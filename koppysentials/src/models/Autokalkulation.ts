export interface Autokalkulation {
  kaufpreis: number
  nutzungsdauer: number
  kilometerprojahr: number
  kwhverbrauch: number
  kostenprokwh: number
  versicherungprojahr: number
}

export interface GespeicherteAutokalkulation extends Autokalkulation {
  id: string
  titel: string
  erstelltAm: string
  aktualisiertAm: string
}