/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // HILBERT SPACE LESSON VARIABLES
    // ========================================

    // ─────────────────────────────────────────
    // Section 1: Inner Product as Geometry
    // ─────────────────────────────────────────
    innerProductAngle: {
        defaultValue: 45,
        type: 'number',
        label: 'Angle θ',
        description: 'Angle between two vectors in degrees',
        unit: '°',
        min: 5,
        max: 175,
        step: 1,
        color: '#0d9488',
    },
    vectorNormU: {
        defaultValue: 3.0,
        type: 'number',
        label: 'Norm of u',
        description: 'Length of vector u',
        min: 0.5,
        max: 5,
        step: 0.1,
        color: '#7c3aed',
    },
    vectorNormV: {
        defaultValue: 2.5,
        type: 'number',
        label: 'Norm of v',
        description: 'Length of vector v',
        min: 0.5,
        max: 5,
        step: 0.1,
        color: '#7c3aed',
    },
    innerProductValue: {
        defaultValue: 5.30,
        type: 'number',
        label: 'Inner Product',
        description: 'Computed inner product value',
        color: '#0d9488',
    },
    innerProductAnswer: {
        defaultValue: '',
        type: 'text',
        label: 'Inner Product Question Answer',
        description: 'Student answer for the inner product question',
        placeholder: '???',
        correctAnswer: '6',
        color: '#0d9488',
    },

    // ─────────────────────────────────────────
    // Section 2: Projection onto a Subspace
    // ─────────────────────────────────────────
    projectionT: {
        defaultValue: 0.5,
        type: 'number',
        label: 'Projection parameter',
        description: 'Parameter controlling projection point along subspace',
        min: 0,
        max: 1,
        step: 0.01,
        color: '#0d9488',
    },
    residualLength: {
        defaultValue: 95.3,
        type: 'number',
        label: 'Residual Length',
        description: 'Length of the residual vector',
        color: '#dc2626',
    },
    residualAngle: {
        defaultValue: 90,
        type: 'number',
        label: 'Residual Angle',
        description: 'Angle of residual to subspace',
        unit: '°',
        color: '#0d9488',
    },
    projectionAnswer: {
        defaultValue: '',
        type: 'select',
        label: 'Projection Question Answer',
        description: 'Student answer for the projection question',
        placeholder: '???',
        correctAnswer: 'longer',
        options: ['shorter', 'longer', 'same'],
        color: '#0d9488',
    },

    // ─────────────────────────────────────────
    // Section 3: From Finite to Infinite Dimensions
    // ─────────────────────────────────────────
    basisTermCount: {
        defaultValue: 1,
        type: 'number',
        label: 'Number of basis terms',
        description: 'How many basis functions are included in the partial sum',
        min: 1,
        max: 20,
        step: 1,
        color: '#7c3aed',
    },
    approximationError: {
        defaultValue: 1.0,
        type: 'number',
        label: 'Approximation Error',
        description: 'Distance from partial sum to target',
        color: '#f59e0b',
    },
    infiniteDimensionsAnswer: {
        defaultValue: '',
        type: 'select',
        label: 'Infinite Dimensions Question Answer',
        description: 'Student answer for the infinite dimensions question',
        placeholder: '???',
        correctAnswer: 'add',
        options: ['stop', 'add', 'resize'],
        color: '#7c3aed',
    },

    // ─────────────────────────────────────────
    // Section 4: Why Completeness Matters
    // ─────────────────────────────────────────
    cauchySequenceStep: {
        defaultValue: 0,
        type: 'number',
        label: 'Cauchy Sequence Step',
        description: 'Current step in the Cauchy sequence animation',
        min: 0,
        max: 10,
        step: 1,
        color: '#3b82f6',
    },
    distanceToTarget: {
        defaultValue: 0.414,
        type: 'number',
        label: 'Distance to Target',
        description: 'Distance from current sequence point to limit',
        color: '#f59e0b',
    },
    completenessAnswer: {
        defaultValue: '',
        type: 'select',
        label: 'Completeness Question Answer',
        description: 'Student answer for the completeness question',
        placeholder: '???',
        correctAnswer: 'incomplete',
        options: ['complete', 'incomplete', 'neither'],
        color: '#0d9488',
    },

    // Highlight variables for linked highlighting
    activeHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Active Highlight',
        description: 'Currently highlighted element ID',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
