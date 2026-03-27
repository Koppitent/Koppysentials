<template>
  <main class="px-4 py-8 text-[color:var(--color-heading)] sm:px-6 lg:py-14">
    <div class="mx-auto w-full max-w-2xl">
      <h1 class="text-3xl font-semibold tracking-tight">Kreditrechner</h1>
      <p class="mt-2 text-sm text-[color:var(--color-text)]">Passe die Werte per Nummernfeld oder Slider an.</p>

      <div class="mt-8 grid gap-6">
        <NumberSliderInput
          id="amount"
          label="Kreditbetrag"
          v-model="amount"
          suffix="EUR"
          :min="2500"
          :max="70000"
          :step="500"
        />

        <NumberSliderInput
          id="interest"
          label="Zinssatz (%)"
          v-model="interestRate"
          suffix="%"
          :min="0"
          :max="20"
          :step="0.1"
        />

        <NumberSliderInput
          id="duration"
          label="Laufzeit (Monate)"
          v-model="durationMonths"
          suffix="Monate"
          :min="12"
          :max="120"
          :step="12"
        />
      </div>

      <section class="mt-8 border-t border-[color:var(--color-border)] pt-6">
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <p class="text-sm text-[color:var(--color-text)]">Geschätzte Monatsrate</p>
            <p class="mt-1 text-2xl font-semibold text-[color:var(--color-text-highlight)]">{{ monthlyPaymentFormatted }}</p>
          </div>

          <div>
            <p class="text-sm text-[color:var(--color-text)]">Nettodarlehensbetrag</p>
            <p class="mt-1 text-2xl font-semibold text-[color:var(--color-heading)]">{{ netLoanAmountFormatted }}</p>
          </div>

          <div>
            <p class="text-sm text-[color:var(--color-text)]">Effektiver Jahreszins</p>
            <p class="mt-1 text-2xl font-semibold text-[color:var(--color-heading)]">{{ effectiveAnnualRateFormatted }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NumberSliderInput from '@/components/NumberSliderInput.vue'

const amount = ref(20000)
const interestRate = ref(6.5)
const durationMonths = ref(48)

const monthlyPayment = computed(() => {
  const principal = amount.value
  const monthlyRate = interestRate.value / 100 / 12
  const months = durationMonths.value

  if (monthlyRate === 0) {
    return principal / months
  }

  const factor = (1 + monthlyRate) ** months
  return (principal * monthlyRate * factor) / (factor - 1)
})

const monthlyPaymentFormatted = computed(() =>
  monthlyPayment.value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }),
)

const netLoanAmountFormatted = computed(() =>
  amount.value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }),
)

const effectiveAnnualRate = computed(() => {
  const nominalAnnualRate = interestRate.value / 100
  return (1 + nominalAnnualRate / 12) ** 12 - 1
})

const effectiveAnnualRateFormatted = computed(() =>
  effectiveAnnualRate.value.toLocaleString('de-DE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
)
</script>
