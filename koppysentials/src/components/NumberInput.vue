<template>
  <div class="grid items-center gap-2.5 md:grid-cols-[1fr_3fr] md:gap-x-4">
    <div>
      <div class="relative">
        <input
          :id="id"
          class="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] px-3 py-2.5 pr-16 text-base text-[color:var(--color-heading)] focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-border-hover)]"
          type="text"
          inputmode="decimal"
          :value="draftValue"
          @input="onTextInput"
          @keydown.enter.prevent="onEnter"
          @blur="onBlur"
        />

        <span
          v-if="suffix"
          class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-[color:var(--color-text)]"
          aria-hidden="true"
        >
          {{ suffix }}
        </span>
      </div>
    </div>

    <div class="grid h-full grid-rows-3">
      <label :for="id" class="text-[0.95rem] font-semibold text-[color:var(--color-heading)]">{{ label }}</label>

      <div class="group relative flex items-center">
        <output
          class="pointer-events-none absolute -top-8 z-10 -translate-x-1/2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] px-2 py-1 text-xs font-semibold text-[color:var(--color-heading)] opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 peer-focus:opacity-100"
          :style="sliderTooltipStyle"
          aria-hidden="true"
        >
          {{ sliderTooltipValue }}
        </output>

        <input
          class="peer h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--color-border)] focus:outline-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[color:var(--color-border-hover)] [&::-webkit-slider-thumb]:bg-[color:var(--color-background)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[color:var(--color-border-hover)] [&::-moz-range-thumb]:bg-[color:var(--color-background)]"
          type="range"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :style="sliderStyle"
          @input="onSliderInput"
        />
      </div>

      <div class="flex items-end justify-between text-xs text-[color:var(--color-text)]" aria-hidden="true">
        <span>{{ minDisplayValue }}</span>
        <span>{{ maxDisplayValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    modelValue: number
    suffix?: string
    min?: number
    max?: number
    step?: number
  }>(),
  {
    suffix: '',
    min: 0,
    max: 100,
    step: 1,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

function clampValue(value: number): number {
  return Math.min(Math.max(value, props.min), props.max)
}

function getStepDecimals(step: number): number {
  const stepString = String(step)
  if (!stepString.includes('.')) {
    return 0
  }

  return stepString.split('.')[1]?.length ?? 0
}

function formatNumberDe(value: number): string {
  const fractionDigits = getStepDecimals(props.step)
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

function parseGermanNumber(rawValue: string | number): number | null {
  if (typeof rawValue === 'number') {
    return Number.isNaN(rawValue) ? null : rawValue
  }

  const trimmed = rawValue.trim()
  if (!trimmed) {
    return null
  }

  const normalized = trimmed.replace(/\./g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeToStep(value: number): number {
  if (props.step <= 0) {
    return value
  }

  const base = props.min
  const scaled = (value - base) / props.step
  const nearestInt = Math.round(scaled)

  if (Math.abs(scaled - nearestInt) < 1e-9) {
    return value
  }

  const roundedUp = Math.ceil(scaled)
  return base + roundedUp * props.step
}

function normalizeAndEmit(rawValue: string | number): number | null {
  const parsed = parseGermanNumber(rawValue)
  if (parsed === null) {
    return null
  }

  const stepNormalized = normalizeToStep(parsed)
  const clamped = clampValue(stepNormalized)
  const precision = getStepDecimals(props.step)
  const finalValue = Number(clamped.toFixed(precision))

  emit('update:modelValue', finalValue)
  return finalValue
}

const formattedModelValue = computed(() => formatNumberDe(props.modelValue))
const draftValue = ref(formattedModelValue.value)

watch(
  () => props.modelValue,
  () => {
    draftValue.value = formattedModelValue.value
  },
)

function onTextInput(event: Event): void {
  const target = event.target as HTMLInputElement
  draftValue.value = target.value
}

function commitInputValue(target: HTMLInputElement): void {
  const normalized = normalizeAndEmit(target.value)
  draftValue.value = formatNumberDe(normalized ?? props.modelValue)
  target.value = draftValue.value
}

function onEnter(event: Event): void {
  const target = event.target as HTMLInputElement
  commitInputValue(target)
}

function onSliderInput(event: Event): void {
  const target = event.target as HTMLInputElement
  normalizeAndEmit(Number(target.value))
}

function onBlur(event: Event): void {
  const target = event.target as HTMLInputElement
  commitInputValue(target)
}

const percentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) {
    return 0
  }

  return ((clampValue(props.modelValue) - props.min) / range) * 100
})

const sliderStyle = computed(() => {
  const progress = `${percentage.value}%`
  return {
    background: `linear-gradient(90deg, var(--color-border-hover) ${progress}, var(--color-border) ${progress})`,
  }
})

const sliderTooltipStyle = computed(() => ({
  left: `${percentage.value}%`,
}))

const sliderTooltipValue = computed(() => {
  const formatted = formatNumberDe(props.modelValue)
  return props.suffix ? `${formatted} ${props.suffix}` : formatted
})

const minDisplayValue = computed(() => {
  const formatted = formatNumberDe(props.min)
  return props.suffix ? `${formatted} ${props.suffix}` : formatted
})

const maxDisplayValue = computed(() => {
  const formatted = formatNumberDe(props.max)
  return props.suffix ? `${formatted} ${props.suffix}` : formatted
})

</script>
