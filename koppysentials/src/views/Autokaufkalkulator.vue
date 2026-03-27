<template>
  <div class="mx-auto w-full max-w-6xl p-6 text-slate-300 md:p-8">
    <div class="mb-6">
      <h1 class="mb-3 text-4xl font-bold">Autokauf-Rechner</h1>
      <p>Berechnen Sie die jährlichen Kosten für den Kauf eines Elektroautos.</p>
      <p>Geben Sie die folgenden Werte an:</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div class="space-y-6">
        <form class="space-y-2 rounded-lg border-2 border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] p-4">
          <NumberSliderInput
            id="kaufpreis"
            label="Kaufpreis EUR"
            v-model="kaufpreis"
            suffix="EUR"
            :min="0"
            :max="100000"
            :step="100"
          />

          <NumberSliderInput
            id="nutzungsdauer"
            label="Nutzungsdauer in Jahren"
            v-model="nutzungsdauer"
            suffix="Jahre"
            :min="0"
            :max="20"
            :step="1"
          />

          <NumberSliderInput
            id="kilometerprojahr"
            label="Kilometer pro Jahr"
            v-model="kilometerprojahr"
            suffix="km"
            :min="1000"
            :max="20000"
            :step="100"
          />

          <NumberSliderInput
            id="kwhverbrauch"
            label="KWh Verbrauch pro 100km"
            v-model="kwhverbrauch"
            suffix="kWh"
            :min="5"
            :max="30"
            :step="0.1"
          />

          <NumberSliderInput
            id="kostenprokwh"
            label="Kosten pro KWh"
            v-model="kostenprokwh"
            suffix="EUR"
            :min="0.1"
            :max="1"
            :step="0.01"
          />

          <NumberSliderInput
            id="versicherungprojahr"
            label="Versicherungskosten pro Jahr"
            v-model="versicherungprojahr"
            suffix="EUR"
            :min="10"
            :max="1500"
            :step="0.01"
          />
        </form>

        <div class="grid gap-3 rounded-lg border-2 border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] p-4 text-center sm:grid-cols-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-400">Jährliche Gesamtkosten</h2>
            <p class="text-xl font-bold">{{ formatCurrency(gesamtkostenProJahr) }}</p>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-slate-400">Stromkosten/Jahr</h2>
            <p class="text-xl font-bold">{{ formatCurrency(stromkostenProJahr) }}</p>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-slate-400">Versicherung/Jahr</h2>
            <p class="text-xl font-bold">{{ formatCurrency(versicherungprojahr) }}</p>
          </div>
        </div>
      </div>

      <aside class="rounded-lg border-2 border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] p-4 lg:sticky lg:top-6">
        <h2 class="mb-3 text-lg font-semibold">Gesamtkostenzusammenstellung</h2>
        <div class="space-y-2 text-sm">
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Abschreibung/Jahr</span>
            <span class="font-semibold">{{ formatCurrency(abschreibungProJahr) }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Strom/Jahr</span>
            <span class="font-semibold">{{ formatCurrency(stromkostenProJahr) }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Versicherung/Jahr</span>
            <span class="font-semibold">{{ formatCurrency(versicherungprojahr) }}</span>
          </div>
          <div class="my-2 h-px bg-[color:var(--color-border)]"></div>
          <div class="flex items-center justify-between gap-4 text-base">
            <span class="font-semibold">Gesamtkosten/Jahr</span>
            <span class="text-lg font-bold">{{ formatCurrency(gesamtkostenProJahr) }}</span>
          </div>
          <div class="my-2 h-px bg-[color:var(--color-border)]"></div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Gesamtkosten/Monat</span>
            <span class="font-semibold">{{ formatCurrency(gesamtkostenProMonat) }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Kosten pro km</span>
            <span class="font-semibold">{{ formatCurrency(kostenProKilometer) }}</span>
          </div>
					<div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Gesamte Kilometer gefahren</span>
            <span class="font-semibold">{{ formatNumber(kilometerprojahr * nutzungsdauer) }} km</span>
          </div>
          <div class="mt-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 text-xs text-slate-400">
            <p>
              Formel: Gesamtkosten/Jahr = Kaufpreis ÷ Nutzungsdauer + Stromkosten/Jahr + Versicherung/Jahr
            </p>
          </div>
					<div class="flex items-center justify-between gap-4">
						<LinkButton
							title="Kalkulation speichern"
							:icon="LucideSave"
							@click="saveCalculation"
						/>
						<LinkButton
							title="Kalkulation exportieren"
							:icon="LucideDownload"
							@click="exportCalculation"
						/>
					</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import NumberSliderInput from '@/components/NumberSliderInput.vue'
import LinkButton from '@/components/LinkButton.vue'
import { LucideDownload, LucideSave } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const kaufpreis = ref(30000)
const nutzungsdauer = ref(5)
const kilometerprojahr = ref(15000)
const kwhverbrauch = ref(15.0)
const kostenprokwh = ref(0.3)
const versicherungprojahr = ref(500)

const sichereNutzungsdauer = computed(() => Math.max(1, nutzungsdauer.value))
const abschreibungProJahr = computed(() => kaufpreis.value / sichereNutzungsdauer.value)
const stromkostenProJahr = computed(() => kilometerprojahr.value * (kwhverbrauch.value / 100) * kostenprokwh.value)
const gesamtkostenProJahr = computed(() => abschreibungProJahr.value + stromkostenProJahr.value + versicherungprojahr.value)
const gesamtkostenProMonat = computed(() => gesamtkostenProJahr.value / 12)
const kostenProKilometer = computed(() => gesamtkostenProJahr.value / kilometerprojahr.value)

const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number) => euroFormatter.format(value)
const formatNumber = (value: number) => numberFormatter.format(value)


const saveCalculation = () => {
	console.log('Kalkulation gespeichert:', {
		kaufpreis: kaufpreis.value,
		nutzungsdauer: nutzungsdauer.value,
		kilometerprojahr: kilometerprojahr.value,
		kwhverbrauch: kwhverbrauch.value,
		kostenprokwh: kostenprokwh.value,
		versicherungprojahr: versicherungprojahr.value
	});
  // Implementation for saving the calculation
}

const exportCalculation = () => {
	console.log('Kalkulation exportiert:', {
		kaufpreis: kaufpreis.value,
		nutzungsdauer: nutzungsdauer.value,
		kilometerprojahr: kilometerprojahr.value,
		kwhverbrauch: kwhverbrauch.value,
		kostenprokwh: kostenprokwh.value,
		versicherungprojahr: versicherungprojahr.value
	});
	// Implementation for exporting the calculation (e.g., as CSV or PDF)
}


</script>