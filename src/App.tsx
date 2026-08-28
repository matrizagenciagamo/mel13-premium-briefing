"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  FlaskConical,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RotateCcw,
  Send,
  ShieldCheck,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Values = Record<string, string>
type SendStatus = "idle" | "sending" | "success" | "error"

const sections = [
  { id: "proyecto", number: "01", eyebrow: "Punto de partida", title: "Proyecto y responsables" },
  { id: "producto", number: "02", eyebrow: "Verdad de producto", title: "Ciencia, fórmula y beneficio" },
  { id: "mercado", number: "03", eyebrow: "Marco comercial", title: "Público, canal y lanzamiento" },
  { id: "territorio", number: "04", eyebrow: "Dirección creativa", title: "Territorio y expresión premium" },
  { id: "tarro", number: "05", eyebrow: "Prioridad industrial", title: "Tarro de 50 ml" },
  { id: "caja", number: "06", eyebrow: "Experiencia exterior", title: "Caja y acabados especiales" },
  { id: "legal", number: "07", eyebrow: "Viabilidad", title: "Textos, regulación y archivos" },
  { id: "cierre", number: "08", eyebrow: "Decisión", title: "Prioridades y aprobación" },
] as const

const requiredBySection: Record<string, string[]> = {
  proyecto: ["contact_name", "contact_email", "decision_owner", "target_date"],
  producto: ["commercial_name", "hero_technology", "innovation_difference", "main_benefits"],
  mercado: ["target_user", "channels", "target_pvp", "launch_date"],
  territorio: ["brand_words", "desired_perception", "avoid_codes"],
  tarro: ["jar_manufacturer", "technical_plan_status", "cap_options", "front_hierarchy"],
  caja: ["dieline_status", "premium_techniques", "technique_priority", "finish_limits"],
  legal: ["legal_copy_status", "regulatory_owner", "markets_languages_reg"],
  cierre: ["non_negotiables", "final_approver", "copy_email", "privacy_consent"],
}

const requiredKeys = Object.values(requiredBySection).flat()

const labelByKey: Record<string, string> = {
  contact_name: "Nombre y apellidos",
  contact_role: "Cargo / área",
  contact_email: "Email de contacto",
  contact_phone: "Teléfono",
  decision_owner: "Coordinación y devolución consolidada",
  target_date: "Fecha objetivo para arte final del tarro",
  project_context: "Hitos, urgencias o condicionantes de calendario",
  commercial_name: "Denominación comercial",
  descriptor: "Descriptor bajo la marca",
  hero_technology: "Tecnología, complejo o activo protagonista",
  innovation_difference: "Qué lo convierte en el mayor desarrollo de MEL13",
  hero_actives: "Activos principales y función",
  main_benefits: "Tres beneficios prioritarios",
  claims_evidence: "Claims y nivel de validación",
  studies_results: "Estudios, porcentajes o resultados disponibles",
  skin_profile: "Tipo de piel / necesidad",
  use_moment: "Momento y modo de uso",
  texture_sensory: "Textura, absorción y acabado",
  fragrance: "Fragancia o perfil olfativo",
  formula_status: "Estado de la fórmula",
  target_user: "Público prioritario",
  purchase_motivation: "Motivación de compra",
  markets: "Mercados de lanzamiento",
  launch_languages: "Idiomas iniciales",
  channels: "Canales",
  target_pvp: "PVP objetivo",
  launch_date: "Fecha de lanzamiento",
  first_run: "Volumen inicial / MOQ",
  competitive_set: "Marcas o productos de referencia competitiva",
  brand_words: "Tres palabras que debe transmitir",
  science_luxury_balance: "Equilibrio ciencia / lujo",
  desired_perception: "Percepciones deseadas",
  preserve_codes: "Códigos MEL13 que deben permanecer",
  avoid_codes: "Códigos, colores o recursos que deben evitarse",
  references: "Referencias visuales adicionales",
  chanel_takeaways: "Qué interesa exactamente de la referencia Chanel",
  name_status: "Estado del nombre MEL13 Premium",
  front_naming: "Arquitectura de nombre preferida",
  jar_manufacturer: "Fabricante y referencia del tarro",
  technical_plan_status: "Plano acotado y área de decoración",
  jar_materials: "Materiales y componentes",
  jar_dimensions: "Medidas y tolerancias",
  cap_options: "Personalización confirmada para la tapa",
  body_options: "Personalización confirmada para el cuerpo",
  jar_color: "Colores y opacidades disponibles",
  front_hierarchy: "Contenido y jerarquía frontal",
  back_content: "Contenido posterior / inferior",
  alignment: "Registro, orientación y tolerancias de decoración",
  accessories: "Espátula, disco, precinto u otros accesorios",
  decorated_sample: "Muestra decorada / prueba industrial",
  jar_constraints: "MOQ, coste, plazo y limitaciones del tarro",
  dieline_status: "Estado del troquel",
  box_structure: "Estructura y sistema de apertura",
  board_options: "Cartones y soportes disponibles",
  surface_finish: "Acabado base de superficie",
  premium_techniques: "Técnicas especiales disponibles",
  technique_priority: "Jerarquía deseada de técnicas",
  finish_limits: "Límites técnicos del fabricante",
  inside_experience: "Interior y ritual de apertura",
  security_elements: "Precinto, inviolabilidad o serialización",
  sustainability: "Criterios de sostenibilidad",
  incremental_budget: "Margen de coste para acabados",
  box_sample: "Prueba de color / maqueta / muestra final",
  box_constraints: "MOQ, plazos y condicionantes de la caja",
  legal_copy_status: "Estado de los textos legales",
  markets_languages_reg: "Países e idiomas regulatorios",
  regulatory_owner: "Responsable de revisión regulatoria",
  approved_claims: "Claims aprobados y wording obligatorio",
  inci: "INCI",
  mandatory_data: "PAO, lote, contenido, advertencias y responsable",
  certifications: "Sellos, patentes o certificaciones",
  barcode: "EAN / código nacional / QR",
  legal_deadline: "Fecha de entrega de contenidos definitivos",
  non_negotiables: "Tres elementos no negociables",
  open_decisions: "Decisiones todavía abiertas",
  consolidated_feedback: "Sistema de devolución consolidada",
  final_approver: "Responsable de aprobación final",
  additional_comments: "Comentarios finales",
  copy_email: "Email(s) que recibirán copia del PDF",
  privacy_consent: "Aceptación de privacidad y envío",
}

const pdfSections: Array<{ title: string; fields: Array<[string, string]> }> = [
  {
    title: "01 · Proyecto y responsables",
    fields: [
      ["Nombre y apellidos", "contact_name"], ["Cargo / área", "contact_role"],
      ["Email", "contact_email"], ["Teléfono", "contact_phone"],
      ["Coordinación", "decision_owner"], ["Arte final del tarro", "target_date"],
      ["Calendario y condicionantes", "project_context"],
    ],
  },
  {
    title: "02 · Ciencia, fórmula y beneficio",
    fields: [
      ["Denominación", "commercial_name"], ["Descriptor", "descriptor"],
      ["Tecnología protagonista", "hero_technology"], ["Salto de innovación", "innovation_difference"],
      ["Activos", "hero_actives"], ["Beneficios", "main_benefits"],
      ["Claims y validación", "claims_evidence"], ["Estudios y resultados", "studies_results"],
      ["Piel / necesidad", "skin_profile"], ["Uso", "use_moment"],
      ["Sensorialidad", "texture_sensory"], ["Fragancia", "fragrance"], ["Estado de fórmula", "formula_status"],
    ],
  },
  {
    title: "03 · Público, canal y lanzamiento",
    fields: [
      ["Público", "target_user"], ["Motivación", "purchase_motivation"], ["Mercados", "markets"],
      ["Idiomas", "launch_languages"], ["Canales", "channels"], ["PVP", "target_pvp"],
      ["Lanzamiento", "launch_date"], ["Volumen / MOQ", "first_run"], ["Competencia", "competitive_set"],
    ],
  },
  {
    title: "04 · Territorio y expresión premium",
    fields: [
      ["Palabras de marca", "brand_words"], ["Ciencia / lujo", "science_luxury_balance"],
      ["Percepción deseada", "desired_perception"], ["Códigos a preservar", "preserve_codes"],
      ["Códigos a evitar", "avoid_codes"], ["Referencias", "references"],
      ["Lectura de Chanel", "chanel_takeaways"], ["Estado del nombre", "name_status"],
      ["Arquitectura frontal", "front_naming"],
    ],
  },
  {
    title: "05 · Tarro de 50 ml",
    fields: [
      ["Fabricante / referencia", "jar_manufacturer"], ["Plano y área", "technical_plan_status"],
      ["Materiales", "jar_materials"], ["Medidas / tolerancias", "jar_dimensions"],
      ["Tapa", "cap_options"], ["Cuerpo", "body_options"], ["Color / opacidad", "jar_color"],
      ["Jerarquía frontal", "front_hierarchy"], ["Posterior / inferior", "back_content"],
      ["Registro", "alignment"], ["Accesorios", "accessories"], ["Muestra", "decorated_sample"],
      ["Límites", "jar_constraints"],
    ],
  },
  {
    title: "06 · Caja y acabados especiales",
    fields: [
      ["Troquel", "dieline_status"], ["Estructura", "box_structure"], ["Soporte", "board_options"],
      ["Acabado base", "surface_finish"], ["Técnicas", "premium_techniques"],
      ["Jerarquía", "technique_priority"], ["Límites", "finish_limits"],
      ["Interior", "inside_experience"], ["Seguridad", "security_elements"],
      ["Sostenibilidad", "sustainability"], ["Coste incremental", "incremental_budget"],
      ["Muestras", "box_sample"], ["Condicionantes", "box_constraints"],
    ],
  },
  {
    title: "07 · Textos, regulación y archivos",
    fields: [
      ["Estado de textos", "legal_copy_status"], ["Países / idiomas", "markets_languages_reg"],
      ["Responsable", "regulatory_owner"], ["Claims", "approved_claims"], ["INCI", "inci"],
      ["Datos obligatorios", "mandatory_data"], ["Sellos / patentes", "certifications"],
      ["Códigos", "barcode"], ["Entrega final", "legal_deadline"],
    ],
  },
  {
    title: "08 · Prioridades y aprobación",
    fields: [
      ["No negociables", "non_negotiables"], ["Decisiones abiertas", "open_decisions"],
      ["Feedback", "consolidated_feedback"], ["Aprobación", "final_approver"],
      ["Comentarios", "additional_comments"], ["Copia del PDF", "copy_email"],
    ],
  },
]

const initialValues: Values = {
  commercial_name: "MEL13 Premium (nombre de trabajo)",
  target_user: "Unisex · mujeres y hombres",
  channels: "Farmacia y parafarmacia",
  science_luxury_balance: "Equilibrio exacto: ciencia y lujo",
  formula_status: "",
  name_status: "Provisional; abierto a propuesta",
  privacy_consent: "",
}

const testValues: Values = {
  ...initialValues,
  contact_name: "PRUEBA FUNCIONAL GAMO",
  contact_role: "Dirección creativa",
  decision_owner: "GAMO · devolución de prueba",
  target_date: "2026-09-15",
  project_context: "Envío técnico de prueba. No corresponde a un briefing real.",
  hero_technology: "Complejo biotecnológico de prueba",
  innovation_difference: "Contenido ficticio para verificar la generación y recepción del PDF.",
  main_benefits: "1. Beneficio de prueba\n2. Beneficio de prueba\n3. Beneficio de prueba",
  target_pvp: "90 € · PRUEBA",
  launch_date: "2026-11-30",
  brand_words: "Preciso · científico · excepcional",
  desired_perception: "Biotecnología avanzada | Lujo silencioso",
  avoid_codes: "PRUEBA · evitar códigos de lujo genérico",
  jar_manufacturer: "Fabricante / referencia de prueba",
  technical_plan_status: "Disponible y definitivo",
  cap_options: "Lacado mate | Hot stamping | Relieve",
  front_hierarchy: "1. MEL13\n2. Tecnología\n3. Descriptor y 50 ml",
  dieline_status: "En preparación por el fabricante",
  premium_techniques: "Gofrado ciego | Hot stamping metálico | Barniz UVI reserva",
  technique_priority: "Protagonista: gofrado ciego\nSecundaria: foil controlado\nInterior: impresión a una tinta",
  finish_limits: "Datos ficticios. Pendiente de ficha técnica del proveedor.",
  legal_copy_status: "En redacción / revisión",
  regulatory_owner: "Responsable regulatorio · PRUEBA",
  markets_languages_reg: "España · ES · PRUEBA",
  non_negotiables: "1. Autoridad científica\n2. Ejecución sobria\n3. Viabilidad industrial",
  final_approver: "Responsable de aprobación · PRUEBA",
  contact_email: "",
  copy_email: "",
  privacy_consent: "",
}

function BrandLockup({ color = "violet" }: { color?: "violet" | "green" }) {
  return (
    <span className={`brand-lockup brand-lockup-${color}`} role="img" aria-label="GAMO Agencia Creativa">
      <span className="sr-only">GAMO Agencia Creativa</span>
    </span>
  )
}

function renderBrandLogo(color: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext("2d")
      if (!context) {
        reject(new Error("No se ha podido preparar el logotipo de GAMO."))
        return
      }
      context.drawImage(image, 0, 0)
      context.globalCompositeOperation = "source-in"
      context.fillStyle = color
      context.fillRect(0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL("image/png"))
    }
    image.onerror = () => reject(new Error("No se ha podido cargar el logotipo de GAMO."))
    image.src = "/gamo-logo-official.png"
  })
}

function PharmamelLockup() {
  return (
    <div className="pharmamel-lockup" role="img" aria-label="Pharmamel">
      <span className="sr-only">Pharmamel</span>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  name,
  error,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  name: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={`field ${error ? "field-error" : ""}`} data-field={name}>
      <div className="field-heading">
        <label htmlFor={name}>{label}{required && <span className="required"> *</span>}</label>
        {hint && <p>{hint}</p>}
      </div>
      {children}
      {error && <p className="error-copy">{error}</p>}
    </div>
  )
}

function SectionCard({
  id,
  number,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  number: string
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section className="form-section" id={id} data-section={id}>
      <header className="section-header">
        <span className="section-number">{number}</span>
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="section-intro">{intro}</p>
        </div>
      </header>
      <div className="section-fields">{children}</div>
    </section>
  )
}

function AppInput({ name, values, update, ...props }: {
  name: string
  values: Values
  update: (name: string, value: string) => void
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  return (
    <Input
      id={name}
      name={name}
      value={values[name] ?? ""}
      onChange={(event) => update(name, event.target.value)}
      {...props}
    />
  )
}

function AppTextarea({ name, values, update, ...props }: {
  name: string
  values: Values
  update: (name: string, value: string) => void
} & Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange">) {
  return (
    <Textarea
      id={name}
      name={name}
      value={values[name] ?? ""}
      onChange={(event) => update(name, event.target.value)}
      {...props}
    />
  )
}

function TagGroup({ name, options, values, update }: {
  name: string
  options: string[]
  values: Values
  update: (name: string, value: string) => void
}) {
  const selected = (values[name] ?? "").split(" | ").filter(Boolean)
  const toggle = (option: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...selected, option]))
      : selected.filter((item) => item !== option)
    update(name, next.join(" | "))
  }
  return (
    <div className="tag-grid" role="group" aria-label={labelByKey[name] ?? name}>
      {options.map((option) => {
        const checked = selected.includes(option)
        return (
          <label className={`tag-option ${checked ? "tag-option-selected" : ""}`} key={option}>
            <Checkbox
              checked={checked}
              onCheckedChange={(state) => toggle(option, state === true)}
              aria-label={option}
            />
            <span>{option}</span>
          </label>
        )
      })}
    </div>
  )
}

function ChoiceCards({ name, options, values, update }: {
  name: string
  options: Array<{ value: string; title: string; copy?: string }>
  values: Values
  update: (name: string, value: string) => void
}) {
  return (
    <RadioGroup
      value={values[name] ?? ""}
      onValueChange={(value) => update(name, value)}
      className="choice-grid"
      aria-label={labelByKey[name] ?? name}
    >
      {options.map((option) => (
        <label className={`choice-card ${values[name] === option.value ? "choice-card-selected" : ""}`} key={option.value}>
          <RadioGroupItem value={option.value} />
          <span><strong>{option.title}</strong>{option.copy && <small>{option.copy}</small>}</span>
        </label>
      ))}
    </RadioGroup>
  )
}

function todayStamp() {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date())
}

export default function Home() {
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeSection, setActiveSection] = useState("proyecto")
  const [savedAt, setSavedAt] = useState<string>("")
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [isTestMode, setIsTestMode] = useState(false)
  const technicalFiles = useRef<HTMLInputElement>(null)
  const legalFiles = useRef<HTMLInputElement>(null)
  const didHydrate = useRef(false)
  const testModeRef = useRef(false)

  const completedRequired = requiredKeys.filter((key) => Boolean(values[key]?.trim())).length
  const progress = Math.round((completedRequired / requiredKeys.length) * 100)

  useEffect(() => {
    try {
      const testMode = new URLSearchParams(window.location.search).get("modo") === "prueba"
      testModeRef.current = testMode
      if (testMode) {
        window.setTimeout(() => {
          setIsTestMode(true)
          setValues(testValues)
        }, 0)
        return
      }
      const stored = window.localStorage.getItem("gamo-mel13-premium-briefing")
      if (stored) {
        const parsed = JSON.parse(stored) as Values
        window.setTimeout(() => {
          setValues({ ...initialValues, ...parsed, privacy_consent: "" })
        }, 0)
      }
    } catch {
      // A corrupt local draft should never block the form.
    } finally {
      didHydrate.current = true
    }
  }, [])

  useEffect(() => {
    if (!didHydrate.current || testModeRef.current) return
    const timer = window.setTimeout(() => {
      const draft = { ...values, privacy_consent: "" }
      window.localStorage.setItem("gamo-mel13-premium-briefing", JSON.stringify(draft))
      setSavedAt(new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date()))
    }, 450)
    return () => window.clearTimeout(timer)
  }, [values])

  useEffect(() => {
    const observed = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: "-18% 0px -64% 0px", threshold: [0, 0.15, 0.35] },
    )
    observed.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const update = (name: string, value: string) => {
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === "contact_email" && (!current.copy_email || current.copy_email === current.contact_email)) {
        next.copy_email = value
      }
      return next
    })
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
    if (sendStatus !== "idle") setSendStatus("idle")
  }

  const sectionComplete = (id: string) => requiredBySection[id].every((key) => Boolean(values[key]?.trim()))

  const resetDraft = () => {
    if (!window.confirm(isTestMode ? "¿Quieres restaurar los datos ficticios de prueba?" : "¿Quieres borrar el borrador guardado en este dispositivo?")) return
    window.localStorage.removeItem("gamo-mel13-premium-briefing")
    setValues(isTestMode ? testValues : initialValues)
    setErrors({})
    setSendStatus("idle")
    setStatusMessage("")
    if (technicalFiles.current) technicalFiles.current.value = ""
    if (legalFiles.current) legalFiles.current.value = ""
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    requiredKeys.forEach((key) => {
      if (!values[key]?.trim()) nextErrors[key] = "Necesitamos este dato para cerrar el briefing."
    })
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (values.contact_email && !emailPattern.test(values.contact_email.trim())) {
      nextErrors.contact_email = "Revisa el formato del email."
    }
    const copyEmails = (values.copy_email ?? "").split(",").map((email) => email.trim()).filter(Boolean)
    if (copyEmails.some((email) => !emailPattern.test(email))) {
      nextErrors.copy_email = "Introduce emails válidos separados por comas."
    }
    const size = [technicalFiles.current, legalFiles.current]
      .flatMap((input) => input?.files ? Array.from(input.files) : [])
      .reduce((total, file) => total + file.size, 0)
    if (size > 8 * 1024 * 1024) {
      nextErrors.attachments = "Los adjuntos superan 8 MB. Reduce el peso antes de enviar."
    }
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      const target = document.querySelector(`[data-field="${first}"]`)
      target?.scrollIntoView({ behavior: "smooth", block: "center" })
      return false
    }
    return true
  }

  const generatePdfBlob = async () => {
    const [{ jsPDF }, gamoVioletLogo, gamoGreenLogo] = await Promise.all([
      import("jspdf"),
      renderBrandLogo("#351d48"),
      renderBrandLogo("#68b98c"),
    ])
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
    const pageWidth = 210
    const pageHeight = 297
    const marginX = 18
    const textWidth = pageWidth - marginX * 2
    let y = 0

    const addPageHeader = (firstPage = false) => {
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, 24, "F")
      doc.addImage(gamoVioletLogo, "PNG", marginX, 6.2, 33, 10.6)
      doc.setDrawColor(104, 185, 140)
      doc.setLineWidth(0.8)
      doc.line(0, 23.6, pageWidth, 23.6)
      doc.setTextColor(53, 29, 72)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.text("MEL13  /  PHARMAMEL DERMO", pageWidth - marginX, 13, { align: "right" })
      y = 34
      if (firstPage) {
        doc.setTextColor(33, 21, 41)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.text("Briefing de packaging", marginX, y)
        y += 8
        doc.setFontSize(15)
        doc.setTextColor(63, 148, 110)
        doc.text("MEL13 · producto premium", marginX, y)
        y += 7
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor(113, 103, 120)
        doc.text(`Generado el ${todayStamp()} · Documento confidencial de trabajo`, marginX, y)
        y += 10
      }
    }

    const ensureSpace = (height: number) => {
      if (y + height < pageHeight - 18) return
      doc.addPage()
      addPageHeader(false)
    }

    addPageHeader(true)

    pdfSections.forEach((section) => {
      ensureSpace(18)
      doc.setDrawColor(104, 185, 140)
      doc.setLineWidth(0.8)
      doc.line(marginX, y, marginX + 12, y)
      y += 5
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(53, 29, 72)
      doc.text(section.title, marginX, y)
      y += 7
      section.fields.forEach(([label, key]) => {
        const value = values[key]?.trim() || "—"
        const lines = doc.splitTextToSize(value, textWidth)
        const entryHeight = 5 + Math.max(1, lines.length) * 4.2 + 3
        ensureSpace(entryHeight)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(6.6)
        doc.setTextColor(63, 148, 110)
        doc.text(label.toUpperCase(), marginX, y)
        y += 4.2
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.4)
        doc.setTextColor(33, 21, 41)
        doc.text(lines, marginX, y)
        y += Math.max(1, lines.length) * 4.2 + 3
      })
      y += 2
    })

    const files = [
      ...(technicalFiles.current?.files ? Array.from(technicalFiles.current.files) : []),
      ...(legalFiles.current?.files ? Array.from(legalFiles.current.files) : []),
    ]
    if (files.length) {
      ensureSpace(20)
      doc.setDrawColor(104, 185, 140)
      doc.line(marginX, y, marginX + 12, y)
      y += 5
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(53, 29, 72)
      doc.text("Archivos adjuntos", marginX, y)
      y += 6
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.4)
      doc.setTextColor(33, 21, 41)
      files.forEach((file) => {
        ensureSpace(6)
        doc.text(`• ${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`, marginX, y)
        y += 5
      })
    }

    const pages = doc.getNumberOfPages()
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page)
      doc.setDrawColor(232, 226, 235)
      doc.setLineWidth(0.25)
      doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(6.5)
      doc.setTextColor(113, 103, 120)
      doc.addImage(gamoGreenLogo, "PNG", marginX, pageHeight - 12.3, 24, 7.7)
      doc.text("info@agenciagamo.es", marginX + 29, pageHeight - 8.2)
      doc.text(`${page} / ${pages}`, pageWidth - marginX, pageHeight - 9, { align: "right" })
    }

    return doc.output("blob")
  }

  const pdfFilename = () => {
    const name = (values.commercial_name || "mel13-premium")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 44)
    return `briefing-${name || "mel13-premium"}.pdf`
  }

  const previewPdf = async () => {
    const tab = window.open("", "_blank")
    try {
      setStatusMessage("Generando la previsualización…")
      const blob = await generatePdfBlob()
      const url = URL.createObjectURL(blob)
      if (tab) tab.location.href = url
      else {
        const link = document.createElement("a")
        link.href = url
        link.download = pdfFilename()
        link.click()
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      setStatusMessage("PDF preparado. Revísalo antes de enviar.")
    } catch {
      tab?.close()
      setStatusMessage("No hemos podido generar el PDF. Vuelve a intentarlo.")
    }
  }

  const downloadPdf = async () => {
    const blob = await generatePdfBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = pdfFilename()
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const submitBriefing = async () => {
    if (!validate()) return
    setSendStatus("sending")
    setStatusMessage("Generando y enviando el briefing…")
    try {
      const pdf = await generatePdfBlob()
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (!value || key === "privacy_consent") return
        formData.append(labelByKey[key] ?? key, value)
      })
      const fileInputs = [technicalFiles.current, legalFiles.current]
      fileInputs.forEach((input) => {
        if (!input?.files) return
        Array.from(input.files).forEach((file) => formData.append("Documentación adjunta", file, file.name))
      })
      formData.append("Briefing PDF", new File([pdf], pdfFilename(), { type: "application/pdf" }))
      formData.append("_subject", `${isTestMode ? "[PRUEBA] " : ""}MEL13 Premium · Briefing completado · ${values.contact_name}`)
      formData.append("_cc", values.copy_email)
      formData.append("_template", "table")
      formData.append("_captcha", "false")
      formData.append("_honey", "")

      const response = await fetch("https://formsubmit.co/ajax/info@agenciagamo.es", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.success === false) throw new Error("Submission failed")
      setSendStatus("success")
      setStatusMessage(`Enviado. Hemos remitido el PDF a GAMO y a ${values.copy_email}.`)
      window.localStorage.removeItem("gamo-mel13-premium-briefing")
      document.getElementById("send-result")?.scrollIntoView({ behavior: "smooth", block: "center" })
    } catch {
      setSendStatus("error")
      setStatusMessage("No se ha podido completar el envío. Descarga el PDF y envíalo a info@agenciagamo.es, o inténtalo de nuevo.")
      document.getElementById("send-result")?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <a className="header-brand" href="#top" aria-label="Ir al inicio"><BrandLockup color="violet" /></a>
          <div className="brand-separator" aria-hidden="true" />
          <PharmamelLockup />
          <div className="header-meta">
            <span className="confidential-pill"><LockKeyhole /> <i>Confidencial</i></span>
            <span className="autosave-status"><Check /> Borrador guardado {savedAt && `· ${savedAt}`}</span>
          </div>
        </div>
      </header>

      {isTestMode && (
        <div className="test-banner" role="status">
          <FlaskConical />
          <p><strong>Modo de prueba.</strong> Los campos clave contienen datos ficticios. Completa tu email, acepta el envío y comprueba el PDF antes de confirmar.</p>
        </div>
      )}

      <div className="page-intro" id="top">
        <div className="intro-watermark" aria-hidden="true">13</div>
        <div className="intro-copy">
          <p className="overline">Briefing estratégico e industrial · 50 ml</p>
          <h1>Construyamos el nuevo<br /><em>producto halo</em> de MEL13.</h1>
          <p className="intro-lead">
            Este briefing parte de una decisión ya tomada: la nueva referencia será el producto de mayor posicionamiento de MEL13. Las respuestas nos permitirán convertir ese salto en una propuesta propia, científica y producible —desde el tarro prioritario hasta la caja y sus acabados especiales.
          </p>
        </div>
        <aside className="intro-facts" aria-label="Datos del proyecto">
          <div><span>Posición</span><strong>Top de gama</strong></div>
          <div><span>Formato</span><strong>Crema facial · 50 ml</strong></div>
          <div><span>Público</span><strong>Unisex</strong></div>
          <div><span>Entregables</span><strong>Tarro + caja</strong></div>
        </aside>
      </div>

      <div className="form-layout">
        <aside className="progress-rail">
          <div className="progress-card">
            <div className="progress-topline"><span>Progreso</span><strong>{progress}%</strong></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            <p>{completedRequired} de {requiredKeys.length} respuestas clave</p>
          </div>
          <nav aria-label="Secciones del briefing">
            {sections.map((section) => {
              const complete = sectionComplete(section.id)
              return (
                <button
                  type="button"
                  className={activeSection === section.id ? "active" : ""}
                  key={section.id}
                  onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className={complete ? "nav-number complete" : "nav-number"}>{complete ? <Check /> : section.number}</span>
                  <span>{section.title}</span>
                </button>
              )
            })}
          </nav>
          <div className="rail-note">
            <ShieldCheck />
            <p><strong>No se envía nada al avanzar.</strong> Puedes cerrar y continuar después desde este mismo dispositivo.</p>
          </div>
          <button type="button" className="reset-link" onClick={resetDraft}><RotateCcw /> Borrar borrador</button>
        </aside>

        <form className="briefing-form" onSubmit={(event) => event.preventDefault()} noValidate>
          <SectionCard
            id="proyecto" number="01" eyebrow="Punto de partida" title="Proyecto y responsables"
            intro="Definimos interlocutores, calendario y circuito de decisión para avanzar con rapidez sin perder precisión."
          >
            <div className="field-grid two-columns">
              <Field label="Nombre y apellidos" name="contact_name" required error={errors.contact_name}>
                <AppInput name="contact_name" values={values} update={update} placeholder="Ej. Juan Miguel…" autoComplete="name" />
              </Field>
              <Field label="Cargo o área" name="contact_role">
                <AppInput name="contact_role" values={values} update={update} placeholder="Dirección, I+D, marketing…" />
              </Field>
              <Field label="Email de contacto" name="contact_email" required error={errors.contact_email}>
                <AppInput name="contact_email" values={values} update={update} placeholder="nombre@empresa.com" type="email" autoComplete="email" />
              </Field>
              <Field label="Teléfono" name="contact_phone">
                <AppInput name="contact_phone" values={values} update={update} placeholder="+34 …" type="tel" autoComplete="tel" />
              </Field>
              <Field label="Quién coordina la devolución consolidada" hint="Una única devolución evita criterios cruzados." name="decision_owner" required error={errors.decision_owner}>
                <AppInput name="decision_owner" values={values} update={update} placeholder="Nombre y función" />
              </Field>
              <Field label="Fecha objetivo para el arte final del tarro" name="target_date" required error={errors.target_date}>
                <AppInput name="target_date" values={values} update={update} type="date" />
              </Field>
            </div>
            <Field label="Hitos, urgencias o condicionantes de calendario" name="project_context">
              <AppTextarea name="project_context" values={values} update={update} placeholder="Fechas de fábrica, ferias, lanzamiento, aprobación regulatoria…" rows={4} />
            </Field>
          </SectionCard>

          <SectionCard
            id="producto" number="02" eyebrow="Verdad de producto" title="Ciencia, fórmula y beneficio"
            intro="La innovación no debe parecer decorativa: necesitamos identificar la evidencia que justificará el valor y ordenará el relato frontal."
          >
            <div className="field-grid two-columns">
              <Field label="Denominación comercial" hint="MEL13 Premium se mantiene como nombre de trabajo." name="commercial_name" required error={errors.commercial_name}>
                <AppInput name="commercial_name" values={values} update={update} />
              </Field>
              <Field label="Descriptor bajo la marca" hint="Provisional si aún no está definido." name="descriptor">
                <AppInput name="descriptor" values={values} update={update} placeholder="Ej. crema regeneradora facial avanzada" />
              </Field>
            </div>
            <Field label="Tecnología, complejo o activo protagonista" hint="Nombre propio, patente o denominación científica que podría convertirse en código de producto." name="hero_technology" required error={errors.hero_technology}>
              <AppTextarea name="hero_technology" values={values} update={update} placeholder="Qué es, cómo se denomina y cuál es su mecanismo de acción…" rows={5} />
            </Field>
            <Field label="¿Qué lo convierte en el mayor desarrollo de MEL13 hasta la fecha?" name="innovation_difference" required error={errors.innovation_difference}>
              <AppTextarea name="innovation_difference" values={values} update={update} placeholder="Diferencia de formulación, concentración, vehículo, absorción, eficacia, patente…" rows={5} />
            </Field>
            <div className="field-grid two-columns">
              <Field label="Activos principales y función" name="hero_actives">
                <AppTextarea name="hero_actives" values={values} update={update} placeholder="Activo · concentración · función" rows={5} />
              </Field>
              <Field label="Tres beneficios prioritarios" hint="Ordénalos de mayor a menor importancia." name="main_benefits" required error={errors.main_benefits}>
                <AppTextarea name="main_benefits" values={values} update={update} placeholder={'1. …\n2. …\n3. …'} rows={5} />
              </Field>
              <Field label="Claims y nivel de validación" name="claims_evidence">
                <AppTextarea name="claims_evidence" values={values} update={update} placeholder="Claim · aprobado / en validación / por estudiar" rows={5} />
              </Field>
              <Field label="Estudios, porcentajes o resultados disponibles" name="studies_results">
                <AppTextarea name="studies_results" values={values} update={update} placeholder="Ensayo instrumental, test de uso, bibliografía…" rows={5} />
              </Field>
              <Field label="Tipo de piel o necesidad prioritaria" name="skin_profile">
                <AppInput name="skin_profile" values={values} update={update} placeholder="Piel madura, sensible, fotoenvejecida…" />
              </Field>
              <Field label="Momento y modo de uso" name="use_moment">
                <AppInput name="use_moment" values={values} update={update} placeholder="Mañana / noche, paso de rutina, cantidad…" />
              </Field>
              <Field label="Textura, absorción y acabado" name="texture_sensory">
                <AppTextarea name="texture_sensory" values={values} update={update} placeholder="Rica pero no grasa, fundente, aterciopelada…" rows={4} />
              </Field>
              <Field label="Fragancia o perfil olfativo" name="fragrance">
                <AppTextarea name="fragrance" values={values} update={update} placeholder="Sin perfume, firma olfativa, alérgenos…" rows={4} />
              </Field>
            </div>
            <Field label="Estado actual de la fórmula" name="formula_status">
              <ChoiceCards name="formula_status" values={values} update={update} options={[
                { value: "Cerrada y validada", title: "Cerrada", copy: "Lista para industrialización" },
                { value: "En validación final", title: "En validación", copy: "Puede haber ajustes menores" },
                { value: "En desarrollo", title: "En desarrollo", copy: "Aún puede cambiar el producto" },
              ]} />
            </Field>
          </SectionCard>

          <SectionCard
            id="mercado" number="03" eyebrow="Marco comercial" title="Público, canal y lanzamiento"
            intro="El estatus superior está fijado; ahora concretamos para quién se diseña, dónde competirá y qué valor debe sostener."
          >
            <div className="field-grid two-columns">
              <Field label="Público prioritario" name="target_user" required error={errors.target_user}>
                <AppInput name="target_user" values={values} update={update} />
              </Field>
              <Field label="Motivación principal de compra" name="purchase_motivation">
                <AppInput name="purchase_motivation" values={values} update={update} placeholder="Eficacia, lujo, recomendación profesional…" />
              </Field>
              <Field label="Mercados de lanzamiento" name="markets">
                <AppInput name="markets" values={values} update={update} placeholder="España, UE, LATAM…" />
              </Field>
              <Field label="Idiomas iniciales" name="launch_languages">
                <AppInput name="launch_languages" values={values} update={update} placeholder="ES / EN / FR…" />
              </Field>
            </div>
            <Field label="Canales" name="channels" required error={errors.channels}>
              <TagGroup name="channels" values={values} update={update} options={[
                "Farmacia y parafarmacia", "Clínicas y centros médicos", "E-commerce propio", "Marketplaces", "Distribución internacional", "Venta profesional",
              ]} />
            </Field>
            <div className="field-grid three-columns">
              <Field label="PVP objetivo" hint="Importe o rango." name="target_pvp" required error={errors.target_pvp}>
                <AppInput name="target_pvp" values={values} update={update} placeholder="Ej. 85–95 €" />
              </Field>
              <Field label="Fecha de lanzamiento" name="launch_date" required error={errors.launch_date}>
                <AppInput name="launch_date" values={values} update={update} type="date" />
              </Field>
              <Field label="Volumen inicial / MOQ" name="first_run">
                <AppInput name="first_run" values={values} update={update} placeholder="Unidades" />
              </Field>
            </div>
            <Field label="Marcas o productos con los que competirá por percepción o precio" name="competitive_set">
              <AppTextarea name="competitive_set" values={values} update={update} placeholder="No solo referencias estéticas: indica también comparables de canal, eficacia y PVP." rows={4} />
            </Field>
          </SectionCard>

          <SectionCard
            id="territorio" number="04" eyebrow="Dirección creativa" title="Territorio y expresión premium"
            intro="Buscamos lujo dermocosmético propio: menos códigos genéricos y más precisión, materialidad y autoridad científica."
          >
            <Field label="Tres palabras que debe transmitir" hint="Evita términos intercambiables; cuanto más específicos, mejor." name="brand_words" required error={errors.brand_words}>
              <AppInput name="brand_words" values={values} update={update} placeholder="Ej. preciso · excepcional · sereno" />
            </Field>
            <Field label="Equilibrio entre ciencia y lujo" name="science_luxury_balance">
              <Select value={values.science_luxury_balance} onValueChange={(value) => update("science_luxury_balance", value)}>
                <SelectTrigger id="science_luxury_balance" className="select-trigger"><SelectValue placeholder="Selecciona una opción" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Predominio científico / clínico">Predominio científico / clínico</SelectItem>
                  <SelectItem value="Ciencia con códigos de lujo">Ciencia con códigos de lujo</SelectItem>
                  <SelectItem value="Equilibrio exacto: ciencia y lujo">Equilibrio exacto: ciencia y lujo</SelectItem>
                  <SelectItem value="Lujo con fundamento científico">Lujo con fundamento científico</SelectItem>
                  <SelectItem value="Predominio sensorial / lujo">Predominio sensorial / lujo</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Percepciones deseadas" name="desired_perception" required error={errors.desired_perception}>
              <TagGroup name="desired_perception" values={values} update={update} options={[
                "Biotecnología avanzada", "Precisión farmacéutica", "Lujo silencioso", "Exclusividad", "Eficacia visible", "Autoridad médica", "Sensorialidad", "Innovación española",
              ]} />
            </Field>
            <div className="field-grid two-columns">
              <Field label="Códigos MEL13 que deben permanecer" name="preserve_codes">
                <AppTextarea name="preserve_codes" values={values} update={update} placeholder="Logo, tipografía, nomenclatura, arquitectura, colores…" rows={5} />
              </Field>
              <Field label="Códigos, colores o recursos que deben evitarse" hint="Por ejemplo: negro espejo, oro evidente, grafismos de IA, exceso de claims…" name="avoid_codes" required error={errors.avoid_codes}>
                <AppTextarea name="avoid_codes" values={values} update={update} placeholder="Qué no debe parecer ni recordar…" rows={5} />
              </Field>
              <Field label="Referencias visuales adicionales" name="references">
                <AppTextarea name="references" values={values} update={update} placeholder="Marca / producto / enlace y qué valor interesa de cada referencia." rows={5} />
              </Field>
              <Field label="¿Qué interesa exactamente de la referencia Chanel?" name="chanel_takeaways">
                <AppTextarea name="chanel_takeaways" values={values} update={update} placeholder="Sobriedad, contraste, tacto, jerarquía, color, forma, reducción visual…" rows={5} />
              </Field>
            </div>
            <div className="field-grid two-columns">
              <Field label="Estado del nombre MEL13 Premium" name="name_status">
                <Select value={values.name_status} onValueChange={(value) => update("name_status", value)}>
                  <SelectTrigger id="name_status" className="select-trigger"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Provisional; abierto a propuesta">Provisional; abierto a propuesta</SelectItem>
                    <SelectItem value="Preferido, pendiente de validación">Preferido, pendiente de validación</SelectItem>
                    <SelectItem value="Definitivo y registrado">Definitivo y registrado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Arquitectura frontal preferida" name="front_naming">
                <AppInput name="front_naming" values={values} update={update} placeholder="MEL13 + denominación + descriptor / tecnología…" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="tarro" number="05" eyebrow="Prioridad industrial" title="Tarro de 50 ml"
            intro="La primera entrega será el arte final del tarro. Necesitamos separar lo que el fabricante ofrece de lo que realmente garantiza en producción."
          >
            <div className="tech-callout">
              <FlaskConical />
              <p><strong>Solicitar al fabricante.</strong> Plano acotado, área imprimible, materiales, guía de color, procesos, tolerancias, MOQ, sobrecostes, plazos y una muestra decorada de producción.</p>
            </div>
            <div className="field-grid two-columns">
              <Field label="Fabricante y referencia exacta del tarro" name="jar_manufacturer" required error={errors.jar_manufacturer}>
                <AppInput name="jar_manufacturer" values={values} update={update} placeholder="Empresa · modelo / código" />
              </Field>
              <Field label="Plano acotado y área de decoración" name="technical_plan_status" required error={errors.technical_plan_status}>
                <Select value={values.technical_plan_status ?? ""} onValueChange={(value) => update("technical_plan_status", value)}>
                  <SelectTrigger id="technical_plan_status" className="select-trigger"><SelectValue placeholder="Selecciona el estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible y definitivo">Disponible y definitivo</SelectItem>
                    <SelectItem value="Disponible, pendiente de confirmar">Disponible, pendiente de confirmar</SelectItem>
                    <SelectItem value="Solicitado al fabricante">Solicitado al fabricante</SelectItem>
                    <SelectItem value="No disponible todavía">No disponible todavía</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Materiales de todos los componentes" name="jar_materials">
                <AppTextarea name="jar_materials" values={values} update={update} placeholder="Tarro exterior, vaso interior, tapa, disco, junta…" rows={4} />
              </Field>
              <Field label="Medidas, tolerancias y área útil" name="jar_dimensions">
                <AppTextarea name="jar_dimensions" values={values} update={update} placeholder="Ancho × fondo × alto, radio, desviaciones, zonas no imprimibles…" rows={4} />
              </Field>
            </div>
            <Field label="Personalización confirmada para la tapa" hint="Marca solo técnicas que el proveedor haya confirmado para este modelo." name="cap_options" required error={errors.cap_options}>
              <TagGroup name="cap_options" values={values} update={update} options={[
                "Color en masa", "Lacado mate", "Lacado brillo", "Metalización", "Efecto cepillado", "Serigrafía", "Tampografía", "Hot stamping", "Relieve", "Bajorrelieve / grabado", "Textura de molde",
              ]} />
            </Field>
            <Field label="Personalización confirmada para el cuerpo" name="body_options">
              <TagGroup name="body_options" values={values} update={update} options={[
                "Transparente", "Translúcido", "Opaco", "Lacado", "Degradado de opacidad", "Serigrafía", "Tampografía", "Hot stamping", "Metalizado parcial", "Grabado de molde",
              ]} />
            </Field>
            <div className="field-grid two-columns">
              <Field label="Colores, opacidades y muestras disponibles" name="jar_color">
                <AppTextarea name="jar_color" values={values} update={update} placeholder="Pantone, masterbatch, lacas estándar, muestra física…" rows={4} />
              </Field>
              <Field label="Contenido y jerarquía frontal" hint="Qué debe verse a primera, segunda y tercera lectura." name="front_hierarchy" required error={errors.front_hierarchy}>
                <AppTextarea name="front_hierarchy" values={values} update={update} placeholder="1. MEL13\n2. Denominación / tecnología\n3. Descriptor / 50 ml…" rows={4} />
              </Field>
              <Field label="Contenido posterior o inferior" name="back_content">
                <AppTextarea name="back_content" values={values} update={update} placeholder="Textos previstos, códigos, PAO, lote…" rows={4} />
              </Field>
              <Field label="Registro, orientación y tolerancias de decoración" name="alignment">
                <AppTextarea name="alignment" values={values} update={update} placeholder="Centrado con caras, desviación máxima, continuidad tapa/cuerpo…" rows={4} />
              </Field>
              <Field label="Espátula, disco, precinto u otros accesorios" name="accessories">
                <AppTextarea name="accessories" values={values} update={update} placeholder="Material, color, ubicación y personalización." rows={4} />
              </Field>
              <Field label="Muestra decorada o prueba industrial" name="decorated_sample">
                <Select value={values.decorated_sample ?? ""} onValueChange={(value) => update("decorated_sample", value)}>
                  <SelectTrigger id="decorated_sample" className="select-trigger"><SelectValue placeholder="Selecciona una opción" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sí, incluida antes de producción">Sí, incluida antes de producción</SelectItem>
                    <SelectItem value="Sí, con coste adicional">Sí, con coste adicional</SelectItem>
                    <SelectItem value="Solo maqueta digital / cromalín">Solo maqueta digital / cromalín</SelectItem>
                    <SelectItem value="Pendiente de confirmar">Pendiente de confirmar</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="MOQ, coste, plazo y cualquier limitación del tarro" name="jar_constraints">
              <AppTextarea name="jar_constraints" values={values} update={update} placeholder="Indica cada técnica con su mínimo, sobrecoste y plazo." rows={5} />
            </Field>
            <Field label="Adjuntar documentación técnica del tarro" hint="Plano, área de impresión, ficha de materiales o presupuesto. Máximo total: 8 MB." name="technical_upload" error={errors.attachments}>
              <label className="upload-zone" htmlFor="technical_upload">
                <Upload />
                <span><strong>Seleccionar archivos</strong><small>PDF, AI, EPS, SVG, JPG, PNG, DOCX o XLSX</small></span>
                <input ref={technicalFiles} id="technical_upload" type="file" multiple accept=".pdf,.ai,.eps,.svg,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />
              </label>
            </Field>
          </SectionCard>

          <SectionCard
            id="caja" number="06" eyebrow="Experiencia exterior" title="Caja y acabados especiales"
            intro="La caja debe elevar la percepción antes de abrirse. Elegiremos una técnica protagonista y una secundaria: el valor estará en la jerarquía y la ejecución, no en acumular efectos."
          >
            <div className="material-strip" aria-label="Principios recomendados">
              <span><i>01</i> Tacto base</span><ArrowRight /><span><i>02</i> Relieve estructural</span><ArrowRight /><span><i>03</i> Acento de luz</span>
            </div>
            <div className="field-grid two-columns">
              <Field label="Estado del troquel" name="dieline_status" required error={errors.dieline_status}>
                <Select value={values.dieline_status ?? ""} onValueChange={(value) => update("dieline_status", value)}>
                  <SelectTrigger id="dieline_status" className="select-trigger"><SelectValue placeholder="Selecciona el estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Definitivo y disponible">Definitivo y disponible</SelectItem>
                    <SelectItem value="En preparación por el fabricante">En preparación por el fabricante</SelectItem>
                    <SelectItem value="Pendiente de seleccionar proveedor">Pendiente de seleccionar proveedor</SelectItem>
                    <SelectItem value="Aún no solicitado">Aún no solicitado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Estructura y sistema de apertura" name="box_structure">
                <AppInput name="box_structure" values={values} update={update} placeholder="Estuche plegable, funda, base+tapa, imán…" />
              </Field>
              <Field label="Cartones y soportes disponibles" name="board_options">
                <AppTextarea name="board_options" values={values} update={update} placeholder="SBS, Folding, Kraft, cartón tintado en masa, metalizado, gramajes…" rows={5} />
              </Field>
              <Field label="Acabado base de superficie" name="surface_finish">
                <AppTextarea name="surface_finish" values={values} update={update} placeholder="Mate natural, estucado, soft-touch, brillo, perlado, antiarañazos…" rows={5} />
              </Field>
            </div>
            <Field label="Técnicas especiales que el proveedor puede aplicar" hint="Confirma compatibilidad entre técnicas, tolerancias y áreas mínimas." name="premium_techniques" required error={errors.premium_techniques}>
              <TagGroup name="premium_techniques" values={values} update={update} options={[
                "Gofrado ciego", "Relieve multinivel", "Bajorrelieve", "Microgofrado", "Hot stamping metálico", "Foil pigmentado", "Barniz UVI reserva", "UVI alto relieve", "Barniz texturado", "Tinta metálica", "Tinta blanca", "Serigrafía", "Laminado mate", "Laminado brillo", "Soft-touch", "Impresión interior",
              ]} />
            </Field>
            <Field label="Jerarquía deseada de técnicas" hint="Indica una protagonista, una secundaria y, si procede, una interior." name="technique_priority" required error={errors.technique_priority}>
              <AppTextarea name="technique_priority" values={values} update={update} placeholder="Protagonista: …\nSecundaria: …\nInterior: …" rows={5} />
            </Field>
            <Field label="Límites técnicos confirmados por el fabricante" hint="Tamaño mínimo, grosor de línea, separación, tolerancia, registro, caras posibles y combinaciones incompatibles." name="finish_limits" required error={errors.finish_limits}>
              <AppTextarea name="finish_limits" values={values} update={update} placeholder="Detalla por técnica o adjunta la ficha del proveedor." rows={6} />
            </Field>
            <div className="field-grid two-columns">
              <Field label="Interior y ritual de apertura" name="inside_experience">
                <AppTextarea name="inside_experience" values={values} update={update} placeholder="Color interior, mensaje, foil, patrón, cuna, tarjeta…" rows={5} />
              </Field>
              <Field label="Precinto, inviolabilidad o serialización" name="security_elements">
                <AppTextarea name="security_elements" values={values} update={update} placeholder="Sello, etiqueta, código único, trazabilidad…" rows={5} />
              </Field>
              <Field label="Criterios de sostenibilidad" name="sustainability">
                <AppTextarea name="sustainability" values={values} update={update} placeholder="FSC, reciclabilidad, reducción de plástico, tintas, monomaterial…" rows={5} />
              </Field>
              <Field label="Margen de coste para acabados" name="incremental_budget">
                <AppTextarea name="incremental_budget" values={values} update={update} placeholder="Coste máximo por unidad o rango aceptable." rows={5} />
              </Field>
              <Field label="Pruebas que puede suministrar el proveedor" name="box_sample">
                <AppTextarea name="box_sample" values={values} update={update} placeholder="Maqueta blanca, prueba de color, muestra con acabados, tirada piloto…" rows={5} />
              </Field>
              <Field label="MOQ, plazos y otros condicionantes" name="box_constraints">
                <AppTextarea name="box_constraints" values={values} update={update} placeholder="Por soporte, número de tintas y técnica especial." rows={5} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="legal" number="07" eyebrow="Viabilidad" title="Textos, regulación y archivos"
            intro="Diseñaremos con información real desde el principio. La aprobación regulatoria y técnica será un hito independiente de la aprobación estética."
          >
            <div className="field-grid two-columns">
              <Field label="Estado de los textos legales" name="legal_copy_status" required error={errors.legal_copy_status}>
                <Select value={values.legal_copy_status ?? ""} onValueChange={(value) => update("legal_copy_status", value)}>
                  <SelectTrigger id="legal_copy_status" className="select-trigger"><SelectValue placeholder="Selecciona el estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Definitivos y aprobados">Definitivos y aprobados</SelectItem>
                    <SelectItem value="En redacción / revisión">En redacción / revisión</SelectItem>
                    <SelectItem value="Disponibles como borrador">Disponibles como borrador</SelectItem>
                    <SelectItem value="Pendientes">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Países e idiomas regulatorios" name="markets_languages_reg" required error={errors.markets_languages_reg}>
                <AppInput name="markets_languages_reg" values={values} update={update} placeholder="España · ES / Portugal · PT…" />
              </Field>
              <Field label="Responsable de revisión regulatoria" name="regulatory_owner" required error={errors.regulatory_owner}>
                <AppInput name="regulatory_owner" values={values} update={update} placeholder="Nombre, empresa y email" />
              </Field>
              <Field label="Fecha de entrega de contenidos definitivos" name="legal_deadline">
                <AppInput name="legal_deadline" values={values} update={update} type="date" />
              </Field>
            </div>
            <div className="field-grid two-columns">
              <Field label="Claims aprobados y wording obligatorio" name="approved_claims">
                <AppTextarea name="approved_claims" values={values} update={update} placeholder="Texto exacto y soporte de validación." rows={5} />
              </Field>
              <Field label="INCI" name="inci">
                <AppTextarea name="inci" values={values} update={update} placeholder="Pegar listado definitivo o indicar archivo adjunto." rows={5} />
              </Field>
              <Field label="PAO, lote, contenido, advertencias y responsable" name="mandatory_data">
                <AppTextarea name="mandatory_data" values={values} update={update} placeholder="Datos exactos y ubicación prevista si existe condicionante." rows={5} />
              </Field>
              <Field label="Sellos, patentes o certificaciones" name="certifications">
                <AppTextarea name="certifications" values={values} update={update} placeholder="Texto y archivos de marca autorizados." rows={5} />
              </Field>
            </div>
            <Field label="EAN, código nacional, QR u otros códigos" name="barcode">
              <AppInput name="barcode" values={values} update={update} placeholder="Número, destino del QR y tamaño mínimo." />
            </Field>
            <Field label="Adjuntar textos, estudios, INCI o activos de marca" hint="Máximo total entre todos los adjuntos: 8 MB." name="legal_upload" error={errors.attachments}>
              <label className="upload-zone" htmlFor="legal_upload">
                <FileText />
                <span><strong>Añadir documentación</strong><small>PDF, DOCX, XLSX, JPG o PNG</small></span>
                <input ref={legalFiles} id="legal_upload" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
              </label>
            </Field>
          </SectionCard>

          <SectionCard
            id="cierre" number="08" eyebrow="Decisión" title="Prioridades y aprobación"
            intro="Cerramos el marco de decisión. Lo que quede abierto aquí se convertirá en una hipótesis creativa que GAMO hará explícita en la presentación."
          >
            <div className="field-grid two-columns">
              <Field label="Tres elementos no negociables" name="non_negotiables" required error={errors.non_negotiables}>
                <AppTextarea name="non_negotiables" values={values} update={update} placeholder={'1. …\n2. …\n3. …'} rows={5} />
              </Field>
              <Field label="Decisiones todavía abiertas" name="open_decisions">
                <AppTextarea name="open_decisions" values={values} update={update} placeholder="Nombre, color, claim, técnica, coste…" rows={5} />
              </Field>
              <Field label="Cómo se consolidarán los comentarios" name="consolidated_feedback">
                <AppTextarea name="consolidated_feedback" values={values} update={update} placeholder="Persona responsable y circuito interno." rows={5} />
              </Field>
              <Field label="Responsable de aprobación final" name="final_approver" required error={errors.final_approver}>
                <AppTextarea name="final_approver" values={values} update={update} placeholder="Nombre y ámbito: creativo, científico, regulatorio, producción." rows={5} />
              </Field>
            </div>
            <Field label="Comentarios finales" name="additional_comments">
              <AppTextarea name="additional_comments" values={values} update={update} placeholder="Cualquier información que deba orientar la primera propuesta." rows={5} />
            </Field>

            <div className="delivery-panel">
              <div className="delivery-icon"><Mail /></div>
              <div className="delivery-copy">
                <p className="section-eyebrow">Entrega automática</p>
                <h3>Un único PDF, la misma información para todos.</h3>
                <p>Al confirmar, el briefing se convertirá en PDF y se enviará a GAMO. Las direcciones indicadas recibirán una copia idéntica.</p>
              </div>
              <Field label="Email(s) que recibirán copia" hint="Puedes separar varias direcciones con comas." name="copy_email" required error={errors.copy_email}>
                <AppInput name="copy_email" values={values} update={update} placeholder="nombre@pharmamel.com" type="text" />
              </Field>
              <div className="privacy-check" data-field="privacy_consent">
                <Checkbox
                  id="privacy_consent"
                  checked={values.privacy_consent === "Aceptado"}
                  onCheckedChange={(state) => update("privacy_consent", state === true ? "Aceptado" : "")}
                  aria-invalid={Boolean(errors.privacy_consent)}
                />
                <label htmlFor="privacy_consent">
                  Confirmo que la información puede enviarse a GAMO Agencia Creativa y a las direcciones indicadas para gestionar este proyecto. He leído la <a href="https://agenciagamo.es/politica-de-privacidad/" target="_blank" rel="noreferrer">política de privacidad</a>.
                </label>
              </div>
              {errors.privacy_consent && <p className="error-copy privacy-error">{errors.privacy_consent}</p>}
            </div>

            <div className="final-actions">
              <div>
                <p><strong>{progress}% completado</strong></p>
                <span>Previsualiza el documento antes de confirmar el envío.</span>
              </div>
              <div className="action-buttons">
                <Button type="button" variant="outline" className="secondary-action" onClick={previewPdf}><FileText /> Previsualizar PDF</Button>
                <Button type="button" className="primary-action" onClick={submitBriefing} disabled={sendStatus === "sending"}>
                  {sendStatus === "sending" ? <LoaderCircle className="spin" /> : <Send />}
                  {sendStatus === "sending" ? "Enviando…" : "Confirmar y enviar"}
                </Button>
              </div>
            </div>

            <div id="send-result" className={`send-result ${sendStatus}`} aria-live="polite">
              {sendStatus === "success" && <CheckCircle2 />}
              {sendStatus === "error" && <ShieldCheck />}
              {sendStatus === "sending" && <LoaderCircle className="spin" />}
              <div>
                {sendStatus === "success" && <strong>Briefing enviado correctamente.</strong>}
                {sendStatus === "error" && <strong>El PDF está a salvo; el envío no se completó.</strong>}
                {sendStatus === "sending" && <strong>Estamos preparando la entrega.</strong>}
                {statusMessage && <p>{statusMessage}</p>}
              </div>
              {sendStatus === "error" && <Button type="button" variant="outline" onClick={downloadPdf}><Download /> Descargar PDF</Button>}
            </div>
          </SectionCard>

          <footer className="form-footer">
            <BrandLockup color="green" />
            <p>Diseño estratégico, identidad y packaging.<br />Granada · info@agenciagamo.es</p>
            <a href="#top">Volver arriba <ArrowDown className="up-arrow" /></a>
          </footer>
        </form>
      </div>
    </main>
  )
}
