<template>
  <div class="mx-auto w-full max-w-6xl p-6 text-slate-300 md:p-8">
    <div class="mb-6">
      <h1 class="mb-3 text-4xl font-bold">Autokauf-Rechner</h1>
      <p>Berechnen Sie die jährlichen Kosten für den Kauf eines Elektroautos.</p>
      <p>Geben Sie die folgenden Werte an:</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
      <div class="space-y-6">
        <form class="space-y-2 p-4">
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

      <aside>
        <div class="rounded-lg border-2 border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] p-4">
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
								@click="exportAsPdf"
							/>
							<LinkButton
								title="Neue Kalkulation"
								:icon="LucideSave"
								@click="resetForm"
							/>
						</div>
					</div>
				</div>
				<div class="rounded-lg border-2 border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] p-4 mt-3">
					<h2 class="mb-3 text-lg font-semibold">Gespeicherte Kalkulationen</h2>
					<div class="space-y-2 text-sm">
					
						<p v-if="savedAutokalkulationen.length == 0" class="text-slate-400">Keine gespeicherten Kalkulationen.</p>
            <div
              v-for="(kalkulation, index) in savedAutokalkulationen"
              :key="kalkulation.id"
              class="space-y-2 rounded-md border bg-[color:var(--color-background)] p-3"
              :class="selectedKalkulationId === kalkulation.id ? 'border-emerald-500' : 'border-[color:var(--color-border)]'"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <input
                    v-model="kalkulation.titel"
                    type="text"
                    class="w-full rounded border border-[color:var(--color-background)] bg-[color:var(--color-background-soft)] px-2 py-1 text-sm font-medium text-[color:var(--color-heading)] outline-none focus:border-emerald-500"
                    placeholder="Titel eingeben"
                    @blur="saveCalculationTitle(kalkulation.id, kalkulation.titel)"
                    @keydown.enter.prevent="saveCalculationTitle(kalkulation.id, kalkulation.titel)"
                  />
                  <p class="text-xs text-slate-400">Aktualisiert: {{ formatDate(kalkulation.aktualisiertAm) }}</p>
                </div>
                <span class="text-xs text-slate-400">{{ formatCurrency(kalkulation.kaufpreis) }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <LinkButton title="Laden" @click="loadCalculation(kalkulation.id)" />
                <LinkButton title="Update" @click="updateCalculation(kalkulation.id)" />
                <LinkButton title="Löschen" @click="deleteCalculation(kalkulation.id)" />
              </div>
						</div>
						
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
import { computed, onMounted, ref } from 'vue'
import type { Autokalkulation, GespeicherteAutokalkulation } from '@/models/Autokalkulation'
import { autokalkulationService } from '@/services/autokalkulationService'
import { jsPDF } from 'jspdf'

const savedAutokalkulationen = ref<GespeicherteAutokalkulation[]>([])
const selectedKalkulationId = ref<string | null>(null)

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

const decimalFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatCurrency = (value: number) => euroFormatter.format(value)
const formatNumber = (value: number) => numberFormatter.format(value)
const formatDecimal = (value: number) => decimalFormatter.format(value)
const formatDate = (isoDate: string) => new Date(isoDate).toLocaleString('de-DE')

const getCurrentValues = (): Autokalkulation => ({
  kaufpreis: kaufpreis.value,
  nutzungsdauer: nutzungsdauer.value,
  kilometerprojahr: kilometerprojahr.value,
  kwhverbrauch: kwhverbrauch.value,
  kostenprokwh: kostenprokwh.value,
  versicherungprojahr: versicherungprojahr.value,
})

const refreshSavedAutokalkulationen = () => {
  savedAutokalkulationen.value = autokalkulationService.loadAll()
}

const applyKalkulation = (kalkulation: Autokalkulation) => {
  kaufpreis.value = kalkulation.kaufpreis
  nutzungsdauer.value = kalkulation.nutzungsdauer
  kilometerprojahr.value = kalkulation.kilometerprojahr
  kwhverbrauch.value = kalkulation.kwhverbrauch
  kostenprokwh.value = kalkulation.kostenprokwh
  versicherungprojahr.value = kalkulation.versicherungprojahr
}


const saveCalculation = () => {
  const created = autokalkulationService.create(getCurrentValues())
  selectedKalkulationId.value = created.id
  refreshSavedAutokalkulationen()
}

const loadCalculation = (id: string) => {
  const kalkulation = savedAutokalkulationen.value.find((entry) => entry.id === id)
	if (kalkulation) {
    selectedKalkulationId.value = kalkulation.id
    applyKalkulation(kalkulation)
	}
}

const updateCalculation = (id: string) => {
  autokalkulationService.update(id, getCurrentValues())
  selectedKalkulationId.value = id
  refreshSavedAutokalkulationen()
}

const saveCalculationTitle = (id: string, titel: string) => {
  autokalkulationService.updateTitle(id, titel)
  refreshSavedAutokalkulationen()
}

const deleteCalculation = (id: string) => {
  autokalkulationService.remove(id)
  if (selectedKalkulationId.value === id) {
    selectedKalkulationId.value = null
  }
  refreshSavedAutokalkulationen()
}

onMounted(() => {
  refreshSavedAutokalkulationen()
})

const exportAsPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const now = new Date()
  const dateLabel = now.toLocaleString('de-DE')
  const dateFilePart = now.toISOString().slice(0, 10)

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 16
  const contentWidth = pageWidth - margin * 2

  const colors = {
    accent: [15, 118, 110] as [number, number, number],
    surface: [241, 245, 249] as [number, number, number],
    text: [15, 23, 42] as [number, number, number],
    muted: [71, 85, 105] as [number, number, number],
    line: [203, 213, 225] as [number, number, number],
  }

  doc.setFillColor(...colors.accent)
  doc.roundedRect(margin, 14, contentWidth, 26, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Autokauf-Kalkulation', margin + 4, 25)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Erstellt am ${dateLabel}`, margin + 4, 32)

  let y = 50
  doc.setTextColor(...colors.text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Eingabewerte', margin, y)
  y += 4

  const inputRows: Array<[string, string]> = [
    ['Kaufpreis', formatCurrency(kaufpreis.value)],
    ['Nutzungsdauer', `${nutzungsdauer.value} Jahre`],
    ['Kilometer pro Jahr', `${formatNumber(kilometerprojahr.value)} km`],
    ['Verbrauch', `${formatDecimal(kwhverbrauch.value)} kWh/100km`],
    ['Strompreis', `${formatCurrency(kostenprokwh.value)} pro kWh`],
    ['Versicherung pro Jahr', formatCurrency(versicherungprojahr.value)],
  ]

  const resultRows: Array<[string, string]> = [
    ['Abschreibung pro Jahr', formatCurrency(abschreibungProJahr.value)],
    ['Stromkosten pro Jahr', formatCurrency(stromkostenProJahr.value)],
    ['Gesamtkosten pro Jahr', formatCurrency(gesamtkostenProJahr.value)],
    ['Gesamtkosten pro Monat', formatCurrency(gesamtkostenProMonat.value)],
    ['Kosten pro Kilometer', `${formatDecimal(kostenProKilometer.value)} EUR/km`],
    ['Gesamte Kilometer', `${formatNumber(kilometerprojahr.value * nutzungsdauer.value)} km`],
  ]

  const drawRows = (rows: Array<[string, string]>) => {
    for (const [label, value] of rows) {
      doc.setDrawColor(...colors.line)
      doc.setFillColor(...colors.surface)
      doc.roundedRect(margin, y, contentWidth, 9, 1, 1, 'FD')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...colors.muted)
      doc.text(label, margin + 3, y + 6)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colors.text)
      doc.text(value, margin + contentWidth - 3, y + 6, { align: 'right' })
      y += 11
    }
  }

  drawRows(inputRows)

  y += 8
  doc.setTextColor(...colors.text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Ergebnisse', margin, y)
  y += 4

  drawRows(resultRows)

  y += 2
  doc.setFillColor(...colors.accent)
  doc.roundedRect(margin, y, contentWidth, 13, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Formel', margin + 3, y + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(
    'Gesamtkosten/Jahr = Kaufpreis / Nutzungsdauer + Stromkosten/Jahr + Versicherung/Jahr',
    margin + 24,
    y + 8,
  )

  doc.save(`autokauf-kalkulation-${dateFilePart}.pdf`)
}

const resetForm = () => {
	kaufpreis.value = 30000
	nutzungsdauer.value = 5
	kilometerprojahr.value = 15000
	kwhverbrauch.value = 15.0
	kostenprokwh.value = 0.3
	versicherungprojahr.value = 500
	selectedKalkulationId.value = null
}

</script>