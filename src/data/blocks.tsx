import { type ReactElement, useEffect, useCallback, useState } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors, useVar, useSetVar } from "@/stores";
import { getDefaultValues, variableDefinitions, getVariableInfo, numberPropsFromDefinition, choicePropsFromDefinition, clozePropsFromDefinition } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import editable components
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineClozeChoice,
    InlineFormula,
    InlineSpotColor,
    InlineFeedback,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";

import { FormulaBlock } from "@/components/molecules";

// ============================================
// SECTION 1: Inner Product as Geometry
// ============================================

/**
 * Inner product visualization where students:
 * 1. Drag an arc handle to set the angle between vectors
 * 2. Drag purple markers to set vector magnitudes
 * The inner product is computed and displayed as a consequence
 */
function InnerProductVisualization() {
    const angle = useVar('innerProductAngle', 45) as number;
    const normU = useVar('vectorNormU', 3.0) as number;
    const normV = useVar('vectorNormV', 2.5) as number;
    const setVar = useSetVar();

    // Compute inner product
    useEffect(() => {
        const angleRad = angle * Math.PI / 180;
        const innerProduct = normU * normV * Math.cos(angleRad);
        setVar('innerProductValue', Math.round(innerProduct * 100) / 100);
    }, [angle, normU, normV, setVar]);

    const angleRad = angle * Math.PI / 180;

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-0.5, 6], y: [-0.5, 5] }}
                showGrid={true}
                movablePoints={[
                    // Angle handle - positioned on arc between vectors
                    {
                        initial: [Math.cos(angleRad / 2) * 1.5, Math.sin(angleRad / 2) * 1.5],
                        position: [Math.cos(angleRad / 2) * 1.5, Math.sin(angleRad / 2) * 1.5],
                        color: "#0d9488",
                        constrain: ([px, py]) => {
                            // Constrain to arc at radius 1.5 from origin
                            const theta = Math.atan2(py, px);
                            const clampedAngle = Math.max(5 * Math.PI / 180, Math.min(175 * Math.PI / 180, theta));
                            return [Math.cos(clampedAngle / 2) * 1.5, Math.sin(clampedAngle / 2) * 1.5];
                        },
                        onChange: ([px, py]) => {
                            const theta = Math.atan2(py, px) * 2; // Double because handle is at midpoint
                            const angleDeg = Math.max(5, Math.min(175, theta * 180 / Math.PI));
                            setVar('innerProductAngle', Math.round(angleDeg));
                        },
                    },
                    // Magnitude handle for vector u (along x-axis)
                    {
                        initial: [normU, 0],
                        position: [normU, 0],
                        color: "#7c3aed",
                        constrain: ([px]) => [Math.max(0.5, Math.min(5, px)), 0],
                        onChange: ([px]) => setVar('vectorNormU', Math.round(px * 10) / 10),
                    },
                    // Magnitude handle for vector v (along angle direction)
                    {
                        initial: [normV * Math.cos(angleRad), normV * Math.sin(angleRad)],
                        position: [normV * Math.cos(angleRad), normV * Math.sin(angleRad)],
                        color: "#7c3aed",
                        constrain: ([px, py]) => {
                            const dist = Math.sqrt(px * px + py * py);
                            const clampedDist = Math.max(0.5, Math.min(5, dist));
                            return [clampedDist * Math.cos(angleRad), clampedDist * Math.sin(angleRad)];
                        },
                        onChange: ([px, py]) => {
                            const dist = Math.sqrt(px * px + py * py);
                            setVar('vectorNormV', Math.round(Math.max(0.5, Math.min(5, dist)) * 10) / 10);
                        },
                    },
                ]}
                dynamicPlots={([angleHandle, uHandle, vHandle]) => {
                    const currentAngleRad = angle * Math.PI / 180;
                    return [
                        // Angle arc
                        {
                            type: "arc" as const,
                            center: [0, 0],
                            radius: 1,
                            startAngle: 0,
                            endAngle: currentAngleRad,
                            color: "#0d9488",
                            weight: 3,
                        },
                        // Vector u (along x-axis)
                        {
                            type: "vector" as const,
                            tail: [0, 0],
                            tip: [normU, 0],
                            color: "#7c3aed",
                            weight: 3,
                        },
                        // Vector v (at angle)
                        {
                            type: "vector" as const,
                            tail: [0, 0],
                            tip: [normV * Math.cos(currentAngleRad), normV * Math.sin(currentAngleRad)],
                            color: "#7c3aed",
                            weight: 3,
                        },
                        // Direction guidelines (dashed)
                        {
                            type: "segment" as const,
                            point1: [0, 0],
                            point2: [6, 0],
                            color: "#cbd5e1",
                            style: "dashed" as const,
                            weight: 1,
                        },
                        {
                            type: "segment" as const,
                            point1: [0, 0],
                            point2: [5 * Math.cos(currentAngleRad), 5 * Math.sin(currentAngleRad)],
                            color: "#cbd5e1",
                            style: "dashed" as const,
                            weight: 1,
                        },
                        // Origin point
                        { type: "point" as const, x: 0, y: 0, color: "#1e293b" },
                        // Labels
                        {
                            type: "label" as const,
                            x: normU / 2,
                            y: -0.3,
                            text: `‖u‖ = ${normU.toFixed(1)}`,
                            color: "#7c3aed",
                        },
                        {
                            type: "label" as const,
                            x: (normV / 2) * Math.cos(currentAngleRad) + 0.3,
                            y: (normV / 2) * Math.sin(currentAngleRad) + 0.2,
                            text: `‖v‖ = ${normV.toFixed(1)}`,
                            color: "#7c3aed",
                        },
                        {
                            type: "label" as const,
                            x: Math.cos(currentAngleRad / 2) * 1.2,
                            y: Math.sin(currentAngleRad / 2) * 1.2 + 0.25,
                            text: `θ = ${angle}°`,
                            color: "#0d9488",
                        },
                    ];
                }}
            />
            <InteractionHintSequence
                hintKey="inner-product-geometry"
                steps={[
                    { gesture: "drag", label: "Drag the teal point to change the angle between vectors", position: { x: "35%", y: "55%" } },
                    { gesture: "drag", label: "Drag the purple points to change vector lengths", position: { x: "70%", y: "50%" } },
                ]}
            />
        </div>
    );
}

/** Reactive display of the inner product value */
function InnerProductDisplay() {
    const innerProduct = useVar('innerProductValue', 5.30) as number;
    return <span style={{ color: '#0d9488', fontWeight: 600 }}>{innerProduct.toFixed(2)}</span>;
}

// ============================================
// SECTION 2: Projection onto a Subspace
// ============================================

/**
 * Two-panel visualization comparing true orthogonal projection
 * with student-adjustable decomposition
 */
function ProjectionVisualization() {
    const setVar = useSetVar();

    // Fixed geometry
    const vectorTip: [number, number] = [4, 3.5];
    const subspaceAngle = -Math.PI / 8; // Slight tilt

    // True orthogonal projection calculation
    const subspaceDir: [number, number] = [Math.cos(subspaceAngle), Math.sin(subspaceAngle)];
    const dot = vectorTip[0] * subspaceDir[0] + vectorTip[1] * subspaceDir[1];
    const trueProj: [number, number] = [dot * subspaceDir[0], dot * subspaceDir[1]];
    const trueResidual = Math.sqrt(
        Math.pow(vectorTip[0] - trueProj[0], 2) +
        Math.pow(vectorTip[1] - trueProj[1], 2)
    );

    // State for adjustable projection
    const [projT, setProjT] = useState(dot);

    const handleProjectionChange = useCallback((t: number) => {
        setProjT(t);
        const proj: [number, number] = [t * subspaceDir[0], t * subspaceDir[1]];
        const residualLen = Math.sqrt(
            Math.pow(vectorTip[0] - proj[0], 2) +
            Math.pow(vectorTip[1] - proj[1], 2)
        );
        setVar('residualLength', Math.round(residualLen * 10) / 10);

        // Calculate angle to subspace
        const residual: [number, number] = [vectorTip[0] - proj[0], vectorTip[1] - proj[1]];
        const normalDir: [number, number] = [-subspaceDir[1], subspaceDir[0]];
        const dotNormal = (residual[0] * normalDir[0] + residual[1] * normalDir[1]) / residualLen;
        const angleToNormal = Math.acos(Math.abs(dotNormal)) * 180 / Math.PI;
        setVar('residualAngle', Math.round(90 - angleToNormal));
    }, [setVar, subspaceDir, vectorTip]);

    useEffect(() => {
        handleProjectionChange(dot);
    }, []);

    const currentProj: [number, number] = [projT * subspaceDir[0], projT * subspaceDir[1]];
    const currentResidualLen = Math.sqrt(
        Math.pow(vectorTip[0] - currentProj[0], 2) +
        Math.pow(vectorTip[1] - currentProj[1], 2)
    );

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Left panel: True projection (locked) */}
            <div className="flex-1">
                <div className="text-center text-sm font-semibold text-slate-600 mb-2">
                    True Projection (perpendicular)
                </div>
                <Cartesian2D
                    height={250}
                    viewBox={{ x: [-1, 6], y: [-1, 5] }}
                    showGrid={true}
                    plots={[
                        // Subspace line
                        {
                            type: "segment",
                            point1: [-0.5 * subspaceDir[0], -0.5 * subspaceDir[1]],
                            point2: [6 * subspaceDir[0], 6 * subspaceDir[1]],
                            color: "#64748b",
                            weight: 3,
                        },
                        // Original vector v
                        {
                            type: "vector",
                            tail: [0, 0],
                            tip: vectorTip,
                            color: "#1e293b",
                            weight: 2,
                        },
                        // Projection vector
                        {
                            type: "vector",
                            tail: [0, 0],
                            tip: trueProj,
                            color: "#059669",
                            weight: 2.5,
                        },
                        // Residual (dashed)
                        {
                            type: "segment",
                            point1: trueProj,
                            point2: vectorTip,
                            color: "#dc2626",
                            style: "dashed",
                            weight: 2,
                        },
                        // Right angle marker (small square)
                        { type: "point", x: trueProj[0], y: trueProj[1], color: "#059669" },
                        { type: "point", x: vectorTip[0], y: vectorTip[1], color: "#1e293b" },
                    ]}
                />
                <div className="text-center text-sm mt-2">
                    Residual: <span className="font-semibold text-red-600">{trueResidual.toFixed(1)}</span>
                </div>
            </div>

            {/* Right panel: Adjustable projection */}
            <div className="flex-1">
                <div className="text-center text-sm font-semibold text-slate-600 mb-2">
                    Your Decomposition (adjustable)
                </div>
                <div className="relative">
                    <Cartesian2D
                        height={250}
                        viewBox={{ x: [-1, 6], y: [-1, 5] }}
                        showGrid={true}
                        movablePoints={[
                            {
                                initial: currentProj,
                                position: currentProj,
                                color: "#0d9488",
                                constrain: ([px, py]) => {
                                    // Project click point onto subspace line
                                    const t = px * subspaceDir[0] + py * subspaceDir[1];
                                    const clampedT = Math.max(0.5, Math.min(5.5, t));
                                    return [clampedT * subspaceDir[0], clampedT * subspaceDir[1]];
                                },
                                onChange: ([px, py]) => {
                                    const t = px * subspaceDir[0] + py * subspaceDir[1];
                                    handleProjectionChange(Math.max(0.5, Math.min(5.5, t)));
                                },
                            },
                        ]}
                        plots={[
                            // Subspace line
                            {
                                type: "segment",
                                point1: [-0.5 * subspaceDir[0], -0.5 * subspaceDir[1]],
                                point2: [6 * subspaceDir[0], 6 * subspaceDir[1]],
                                color: "#64748b",
                                weight: 3,
                            },
                            // Original vector v
                            {
                                type: "vector",
                                tail: [0, 0],
                                tip: vectorTip,
                                color: "#1e293b",
                                weight: 2,
                            },
                        ]}
                        dynamicPlots={([projPoint]) => {
                            const isOptimal = Math.abs(currentResidualLen - trueResidual) < 0.1;
                            return [
                                // Projection vector
                                {
                                    type: "vector" as const,
                                    tail: [0, 0],
                                    tip: projPoint,
                                    color: "#059669",
                                    weight: 2.5,
                                },
                                // Residual
                                {
                                    type: "segment" as const,
                                    point1: projPoint,
                                    point2: vectorTip,
                                    color: isOptimal ? "#059669" : "#0d9488",
                                    weight: 3,
                                },
                                { type: "point" as const, x: vectorTip[0], y: vectorTip[1], color: "#1e293b" },
                            ];
                        }}
                    />
                    <InteractionHintSequence
                        hintKey="projection-adjust"
                        steps={[
                            { gesture: "drag", label: "Drag the teal point along the subspace to change the decomposition", position: { x: "50%", y: "65%" } },
                        ]}
                    />
                </div>
                <div className="text-center text-sm mt-2">
                    Residual: <span className="font-semibold" style={{ color: '#0d9488' }}>{currentResidualLen.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SECTION 3: From Finite to Infinite Dimensions
// ============================================

/**
 * Interactive Fourier series approximation:
 * Students drag a slider to add more basis terms and watch
 * the approximation converge to a target function (square wave)
 */
function FourierApproximationVisualization() {
    const termCount = useVar('basisTermCount', 1) as number;
    const setVar = useSetVar();

    // Square wave target function
    const squareWave = (x: number): number => {
        const normalized = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return normalized < Math.PI ? 1 : -1;
    };

    // Fourier series partial sum (square wave = sum of odd harmonics)
    const fourierSum = (x: number, n: number): number => {
        let sum = 0;
        for (let k = 0; k < n; k++) {
            const harmonic = 2 * k + 1; // 1, 3, 5, 7, ...
            sum += (4 / (Math.PI * harmonic)) * Math.sin(harmonic * x);
        }
        return sum;
    };

    // Calculate approximation error
    useEffect(() => {
        // Compute L2 error at sample points
        let errorSum = 0;
        const samples = 100;
        for (let i = 0; i < samples; i++) {
            const x = (i / samples) * 2 * Math.PI;
            const diff = squareWave(x) - fourierSum(x, termCount);
            errorSum += diff * diff;
        }
        const error = Math.sqrt(errorSum / samples);
        setVar('approximationError', Math.round(error * 100) / 100);
    }, [termCount, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={300}
                viewBox={{ x: [-0.5, 2 * Math.PI + 0.5], y: [-1.8, 1.8] }}
                showGrid={true}
                movablePoints={[
                    {
                        // Term count control - horizontal slider at bottom
                        initial: [termCount * 0.3, -1.5],
                        position: [termCount * 0.3, -1.5],
                        color: "#7c3aed",
                        constrain: ([px]) => [Math.max(0.3, Math.min(6, px)), -1.5],
                        onChange: ([px]) => {
                            const n = Math.max(1, Math.min(20, Math.round(px / 0.3)));
                            setVar('basisTermCount', n);
                        },
                    },
                ]}
                plots={[
                    // Target function (square wave) - shown as dashed reference
                    {
                        type: "function",
                        fn: squareWave,
                        color: "#f59e0b",
                        weight: 2,
                        style: "dashed",
                    },
                ]}
                dynamicPlots={([sliderPoint]) => {
                    return [
                        // Fourier approximation
                        {
                            type: "function" as const,
                            fn: (x: number) => fourierSum(x, termCount),
                            color: "#7c3aed",
                            weight: 3,
                        },
                        // Slider track
                        {
                            type: "segment" as const,
                            point1: [0.3, -1.5],
                            point2: [6, -1.5],
                            color: "#cbd5e1",
                            weight: 2,
                        },
                        // Labels
                        {
                            type: "label" as const,
                            x: 3.14,
                            y: 1.5,
                            text: `n = ${termCount} terms`,
                            color: "#7c3aed",
                        },
                    ];
                }}
            />
            <InteractionHintSequence
                hintKey="fourier-terms"
                steps={[
                    { gesture: "drag-horizontal", label: "Drag the purple point left/right to add or remove basis terms", position: { x: "50%", y: "85%" } },
                ]}
            />
        </div>
    );
}

/** Display current approximation error */
function ApproximationErrorDisplay() {
    const error = useVar('approximationError', 1.0) as number;
    return <span style={{ color: '#f59e0b', fontWeight: 600 }}>{error.toFixed(2)}</span>;
}

// ============================================
// SECTION 4: Why Completeness Matters
// ============================================

/**
 * Side-by-side comparison of Cauchy sequences in Q^2 vs R^2
 * Students see the same sequence with different fates
 */
function CompletenessVisualization() {
    const [sequenceStep, setSequenceStep] = useState(0);
    const setVar = useSetVar();

    // Rational approximations to sqrt(2)
    const sqrt2Approx = [
        [1.0, 1.0],
        [1.4, 1.4],
        [1.41, 1.41],
        [1.414, 1.414],
        [1.4142, 1.4142],
        [1.41421, 1.41421],
        [1.414213, 1.414213],
    ];

    const sqrt2 = Math.sqrt(2);
    const target: [number, number] = [sqrt2, sqrt2];

    // Update distance to target
    useEffect(() => {
        if (sequenceStep > 0 && sequenceStep <= sqrt2Approx.length) {
            const current = sqrt2Approx[sequenceStep - 1];
            const dist = Math.sqrt(
                Math.pow(current[0] - sqrt2, 2) + Math.pow(current[1] - sqrt2, 2)
            );
            setVar('distanceToTarget', Math.round(dist * 1000) / 1000);
        }
    }, [sequenceStep, setVar]);

    const addNextPoint = () => {
        if (sequenceStep < sqrt2Approx.length) {
            setSequenceStep(s => s + 1);
        }
    };

    const reset = () => {
        setSequenceStep(0);
        setVar('distanceToTarget', 0.414);
    };

    // Generate plots for both panels
    const generateSequencePlots = (showLimit: boolean) => {
        const plots: any[] = [
            // Axes
            {
                type: "segment",
                point1: [0, 0],
                point2: [2.2, 0],
                color: "#94a3b8",
                weight: 1,
            },
            {
                type: "segment",
                point1: [0, 0],
                point2: [0, 2.2],
                color: "#94a3b8",
                weight: 1,
            },
        ];

        // Target zone
        if (showLimit) {
            plots.push({
                type: "circle",
                center: target,
                radius: 0.15,
                color: "#059669",
                fillOpacity: 0.2,
            });
            plots.push({
                type: "point",
                x: target[0],
                y: target[1],
                color: "#059669",
            });
        } else {
            plots.push({
                type: "circle",
                center: target,
                radius: 0.15,
                color: "#f59e0b",
                fillOpacity: 0.1,
                strokeStyle: "dashed",
            });
        }

        // Sequence points
        for (let i = 0; i < sequenceStep; i++) {
            const pt = sqrt2Approx[i];
            const opacity = 0.3 + 0.7 * (i / Math.max(1, sequenceStep - 1));

            plots.push({
                type: "point",
                x: pt[0],
                y: pt[1],
                color: "#3b82f6",
            });

            // Connect to previous point
            if (i > 0) {
                plots.push({
                    type: "segment",
                    point1: sqrt2Approx[i - 1],
                    point2: pt,
                    color: "#3b82f6",
                    weight: 1,
                    style: "dashed",
                });
            }
        }

        return plots;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left panel: Q^2 (rationals) */}
                <div className="flex-1">
                    <div className="text-center text-sm font-semibold text-slate-600 mb-2">
                        Q² (Rationals only)
                    </div>
                    <Cartesian2D
                        height={250}
                        viewBox={{ x: [-0.2, 2.2], y: [-0.2, 2.2] }}
                        showGrid={true}
                        plots={generateSequencePlots(false)}
                    />
                    <div className="text-center text-sm mt-2 text-red-600 font-medium">
                        {sequenceStep >= 3 ? "Limit not in Q²!" : "Click to place points"}
                    </div>
                </div>

                {/* Right panel: R^2 (reals) */}
                <div className="flex-1">
                    <div className="text-center text-sm font-semibold text-slate-600 mb-2">
                        R² (All reals)
                    </div>
                    <Cartesian2D
                        height={250}
                        viewBox={{ x: [-0.2, 2.2], y: [-0.2, 2.2] }}
                        showGrid={true}
                        plots={generateSequencePlots(true)}
                    />
                    <div className="text-center text-sm mt-2 text-green-600 font-medium">
                        {sequenceStep >= 3 ? "Converges to (√2, √2) ✓" : "Click to place points"}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={addNextPoint}
                    disabled={sequenceStep >= sqrt2Approx.length}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Add Next Point
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="text-center text-sm mt-3 text-slate-600">
                Points placed: <span className="font-semibold">{sequenceStep}</span>
                {sequenceStep > 0 && (
                    <>
                        {" "} | Distance to (√2, √2): <span className="font-semibold text-amber-600">{
                            Math.sqrt(
                                Math.pow(sqrt2Approx[sequenceStep - 1][0] - sqrt2, 2) +
                                Math.pow(sqrt2Approx[sequenceStep - 1][1] - sqrt2, 2)
                            ).toFixed(4)
                        }</span>
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================
// BLOCKS CONFIGURATION
// ============================================

export const blocks: ReactElement[] = [
    // ========================================
    // TITLE
    // ========================================
    <StackLayout key="layout-title" maxWidth="xl">
        <Block id="lesson-title" padding="lg">
            <EditableH1 id="h1-lesson-title" blockId="lesson-title">
                The Geometry of Hilbert Space
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-subtitle" maxWidth="xl">
        <Block id="lesson-subtitle" padding="sm">
            <EditableParagraph id="para-subtitle" blockId="lesson-subtitle">
                Exploring infinite-dimensional vector spaces through interactive visualizations
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================
    // SECTION 1: Inner Product as Geometry
    // ========================================
    <StackLayout key="layout-section1-title" maxWidth="xl">
        <Block id="inner-product-title" padding="md">
            <EditableH2 id="h2-inner-product" blockId="inner-product-title">
                1. Inner Product as Geometry
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-intro" maxWidth="xl">
        <Block id="inner-product-intro" padding="sm">
            <EditableParagraph id="para-inner-product-intro" blockId="inner-product-intro">
                The inner product <InlineFormula latex="\langle u, v \rangle" colorMap={{}} /> isn't just a formula to compute — it's a geometric object that encodes both <strong>length</strong> and <strong>angle</strong>. Instead of starting with vectors and computing the inner product, let's flip the script: you specify the geometry, and the inner product follows.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-instruction" maxWidth="xl">
        <Block id="inner-product-instruction" padding="sm">
            <EditableParagraph id="para-inner-product-instruction" blockId="inner-product-instruction">
                <strong>Try this:</strong> Drag the <InlineSpotColor varName="innerProductAngle" color="#0d9488">teal arc handle</InlineSpotColor> to set the angle between two vectors. Then drag the <InlineSpotColor varName="vectorNormU" color="#7c3aed">purple markers</InlineSpotColor> along each arm to set their lengths. Watch how the inner product is <em>forced</em> by your geometric choices.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-viz" maxWidth="xl">
        <Block id="inner-product-visualization" padding="md" hasVisualization>
            <InnerProductVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-readout" maxWidth="xl">
        <Block id="inner-product-readout" padding="sm">
            <EditableParagraph id="para-inner-product-readout" blockId="inner-product-readout">
                <InlineSpotColor varName="innerProductAngle" color="#0d9488">Angle θ:</InlineSpotColor>{" "}
                <InlineScrubbleNumber varName="innerProductAngle" {...numberPropsFromDefinition(getVariableInfo('innerProductAngle'))} formatValue={(v) => `${v}°`} />{" "}
                | <InlineSpotColor varName="vectorNormU" color="#7c3aed">‖u‖:</InlineSpotColor>{" "}
                <InlineScrubbleNumber varName="vectorNormU" {...numberPropsFromDefinition(getVariableInfo('vectorNormU'))} />{" "}
                | <InlineSpotColor varName="vectorNormV" color="#7c3aed">‖v‖:</InlineSpotColor>{" "}
                <InlineScrubbleNumber varName="vectorNormV" {...numberPropsFromDefinition(getVariableInfo('vectorNormV'))} />
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-formula" maxWidth="xl">
        <Block id="inner-product-formula" padding="md">
            <FormulaBlock
                latex="\langle u, v \rangle = \|u\| \|v\| \cos\theta = "
                colorMap={{}}
            />
            <div className="text-center text-2xl font-semibold" style={{ color: '#0d9488' }}>
                <InnerProductDisplay />
            </div>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-explanation" maxWidth="xl">
        <Block id="inner-product-explanation" padding="sm">
            <EditableParagraph id="para-inner-product-explanation" blockId="inner-product-explanation">
                Notice something profound: once you fix the angle and the two lengths, the inner product is <em>completely determined</em>. There's no algebraic freedom left — the geometry forces the algebra. This is why the inner product is fundamentally geometric: it's measuring how much two vectors "agree" in both direction and magnitude.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section1-question" maxWidth="xl">
        <Block id="inner-product-question" padding="md">
            <EditableParagraph id="para-inner-product-question" blockId="inner-product-question">
                <strong>Check your understanding:</strong> If two vectors have lengths 4 and 3, and the angle between them is 60°, what is their inner product?{" "}
                <InlineFeedback varName="innerProductAnswer" correctValue="6" feedbackCorrect="Correct! 4 × 3 × cos(60°) = 6" feedbackIncorrect="Not quite — try the formula ‖u‖‖v‖cos(θ). Hint: cos(60°) = 0.5">
                    <InlineClozeInput varName="innerProductAnswer" correctAnswer="6" {...clozePropsFromDefinition(getVariableInfo('innerProductAnswer'))} />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================
    // SECTION 2: Projection onto a Subspace
    // ========================================
    <StackLayout key="layout-section2-title" maxWidth="xl">
        <Block id="projection-title" padding="md">
            <EditableH2 id="h2-projection" blockId="projection-title">
                2. Projection onto a Subspace
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section2-intro" maxWidth="xl">
        <Block id="projection-intro" padding="sm">
            <EditableParagraph id="para-projection-intro" blockId="projection-intro">
                Orthogonal projection finds the point in a subspace closest to a given vector. But why must the residual (the difference) be perpendicular? Let's see what happens when it's not.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section2-instruction" maxWidth="xl">
        <Block id="projection-instruction" padding="sm">
            <EditableParagraph id="para-projection-instruction" blockId="projection-instruction">
                <strong>Try this:</strong> The left panel shows the true orthogonal projection (residual locked perpendicular). In the right panel, drag the <InlineSpotColor varName="projectionT" color="#0d9488">teal point</InlineSpotColor> along the subspace to tilt the residual away from perpendicular. Watch how the residual gets longer.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section2-viz" maxWidth="xl">
        <Block id="projection-visualization" padding="md" hasVisualization>
            <ProjectionVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section2-explanation" maxWidth="xl">
        <Block id="projection-explanation" padding="sm">
            <EditableParagraph id="para-projection-explanation" blockId="projection-explanation">
                You can decompose a vector into "subspace component + residual" in infinitely many ways. But only the perpendicular decomposition minimizes the residual length. Perpendicularity isn't part of the definition of "a decomposition" — it's what makes a decomposition <em>optimal</em>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section2-question" maxWidth="xl">
        <Block id="projection-question" padding="md">
            <EditableParagraph id="para-projection-question" blockId="projection-question">
                <strong>Check your understanding:</strong> In the right panel, what happens to the residual length as you move away from the perpendicular position?{" "}
                <InlineFeedback varName="projectionAnswer" correctValue="longer" feedbackCorrect="Correct! Any non-perpendicular decomposition has a longer residual." feedbackIncorrect="Try dragging the teal point and watch the residual length change.">
                    <InlineClozeChoice varName="projectionAnswer" correctAnswer="longer" options={["shorter", "longer", "same"]} {...choicePropsFromDefinition(getVariableInfo('projectionAnswer'))} />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================
    // SECTION 3: From Finite to Infinite Dimensions
    // ========================================
    <StackLayout key="layout-section3-title" maxWidth="xl">
        <Block id="infinite-dimensions-title" padding="md">
            <EditableH2 id="h2-infinite-dimensions" blockId="infinite-dimensions-title">
                3. From Finite to Infinite Dimensions
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-intro" maxWidth="xl">
        <Block id="infinite-dimensions-intro" padding="sm">
            <EditableParagraph id="para-infinite-dimensions-intro" blockId="infinite-dimensions-intro">
                "Infinite dimensions" sounds impossible to visualize. But watch: each new orthogonal basis function is just another independent direction you can move in. Let's see how adding more terms gets us closer to a target function.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-instruction" maxWidth="xl">
        <Block id="infinite-dimensions-instruction" padding="sm">
            <EditableParagraph id="para-infinite-dimensions-instruction" blockId="infinite-dimensions-instruction">
                <strong>Try this:</strong> Drag the <InlineSpotColor varName="basisTermCount" color="#7c3aed">purple slider point</InlineSpotColor> to add more Fourier basis terms. Watch how the purple approximation curve converges toward the orange target (a square wave).
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-viz" maxWidth="xl">
        <Block id="infinite-dimensions-visualization" padding="md" hasVisualization>
            <FourierApproximationVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-readout" maxWidth="xl">
        <Block id="infinite-dimensions-readout" padding="sm">
            <EditableParagraph id="para-infinite-dimensions-readout" blockId="infinite-dimensions-readout">
                <InlineSpotColor varName="basisTermCount" color="#7c3aed">Basis terms:</InlineSpotColor>{" "}
                <InlineScrubbleNumber varName="basisTermCount" {...numberPropsFromDefinition(getVariableInfo('basisTermCount'))} />{" "}
                | <InlineSpotColor varName="approximationError" color="#f59e0b">Approximation error:</InlineSpotColor>{" "}
                <ApproximationErrorDisplay />
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-explanation" maxWidth="xl">
        <Block id="infinite-dimensions-explanation" padding="sm">
            <EditableParagraph id="para-infinite-dimensions-explanation" blockId="infinite-dimensions-explanation">
                Each new basis function gives you another independent direction to move in. In a Hilbert space, you can have infinitely many such orthogonal directions — and the partial sums of your series get arbitrarily close to any target. There's no mystery: it's the same projection idea, repeated forever.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section3-question" maxWidth="xl">
        <Block id="infinite-dimensions-question" padding="md">
            <EditableParagraph id="para-infinite-dimensions-question" blockId="infinite-dimensions-question">
                <strong>Check your understanding:</strong> If you've used 5 basis terms but the approximation error is still large, what should you do?{" "}
                <InlineFeedback varName="infiniteDimensionsAnswer" correctValue="add" feedbackCorrect="Correct! More orthogonal basis functions let you get closer to the target." feedbackIncorrect="Think about what happens when you run out of directions to move in.">
                    <InlineClozeChoice varName="infiniteDimensionsAnswer" correctAnswer="add" options={["stop", "add", "resize"]} {...choicePropsFromDefinition(getVariableInfo('infiniteDimensionsAnswer'))} />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================
    // SECTION 4: Why Completeness Matters
    // ========================================
    <StackLayout key="layout-section4-title" maxWidth="xl">
        <Block id="completeness-title" padding="md">
            <EditableH2 id="h2-completeness" blockId="completeness-title">
                4. Why Completeness Matters
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-intro" maxWidth="xl">
        <Block id="completeness-intro" padding="sm">
            <EditableParagraph id="para-completeness-intro" blockId="completeness-intro">
                A Hilbert space isn't just an inner product space — it's a <em>complete</em> one. This means every Cauchy sequence converges to a point <em>inside</em> the space. Why does this matter? Let's see what goes wrong without it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-instruction" maxWidth="xl">
        <Block id="completeness-instruction" padding="sm">
            <EditableParagraph id="para-completeness-instruction" blockId="completeness-instruction">
                <strong>Try this:</strong> Click "Add Next Point" to build a Cauchy sequence of rational approximations to (√2, √2). Both grids show the <em>same</em> sequence: left is Q² (rationals), right is R² (reals). Watch what happens as you approach an irrational target.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-viz" maxWidth="xl">
        <Block id="completeness-visualization" padding="md" hasVisualization>
            <CompletenessVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-explanation" maxWidth="xl">
        <Block id="completeness-explanation" padding="sm">
            <EditableParagraph id="para-completeness-explanation" blockId="completeness-explanation">
                The same Cauchy sequence has completely different fates depending on the ambient space. In Q², it aims at a point that doesn't exist — the sequence gets arbitrarily close to itself, but has nowhere to land. In R², the limit √2 actually exists, so convergence succeeds.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-conclusion" maxWidth="xl">
        <Block id="completeness-conclusion" padding="sm">
            <EditableParagraph id="para-completeness-conclusion" blockId="completeness-conclusion">
                This is why completeness matters for Hilbert spaces. When we take infinite sums (like Fourier series), we need the limit to exist in our space. Without completeness, calculus breaks — limits, projections, and approximations can all "fall through the gaps."
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section4-question" maxWidth="xl">
        <Block id="completeness-question" padding="md">
            <EditableParagraph id="para-completeness-question" blockId="completeness-question">
                <strong>Check your understanding:</strong> A sequence satisfies the Cauchy criterion but its limit is not in the space. This space is:{" "}
                <InlineFeedback varName="completenessAnswer" correctValue="incomplete" feedbackCorrect="Correct! Completeness means all Cauchy sequences converge inside the space." feedbackIncorrect="Remember: complete spaces have ALL Cauchy limits inside.">
                    <InlineClozeChoice varName="completenessAnswer" correctAnswer="incomplete" options={["complete", "incomplete", "neither"]} {...choicePropsFromDefinition(getVariableInfo('completenessAnswer'))} />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================
    // FOOTER
    // ========================================
    <StackLayout key="layout-footer" maxWidth="xl">
        <Block id="lesson-footer" padding="lg">
            <hr className="my-6 border-t border-gray-200" />
            <EditableParagraph id="para-footer" blockId="lesson-footer">
                <em>The Geometry of Hilbert Space</em> — An explorable explanation
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
