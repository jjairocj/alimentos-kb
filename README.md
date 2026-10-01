# Ciencia & Química de los Alimentos — Base de Conocimiento Científica Interactiva

Plataforma científica interactiva y base de conocimiento orientada a adultos para la alfabetización científica avanzada en ciencia, bioquímica, termodinámica y química de los alimentos.

Diseñada con un estándar analítico de laboratorio, rigor académico, citas a literatura indexada y escala de evidencia científica.

---

## 🔬 Características Principales

### 1. Programa Curricular Troncal (26 Módulos)
- **Fase I: Fundamentos Fisicoquímicos y Celulares (M00 – M07):** Química general, biomoléculas, agua y sistemas dispersos, biología celular y principios de evidencia.
- **Fase II: Alimentos, Transformación y Microbiología (M08 – M15):** Grupos de alimentos, cinética microbiológica, digestión, bioenergética y procesamiento.
- **Fase III: Aditivos, Metabolismo y Toxicología (M16 – M20):** Química de aditivos INS, toxicología alimentaria, microbiota y alimentos ultraprocesados.
- **Fase IV: Regulación, Análisis Forense y Mitos (M21 – M23):** Etiquetado nutricional comparado, marco legal e investigación crítica de afirmaciones.

### 2. Enciclopedia Molecular y Red de Conceptos (249 Conceptos)
- Clasificados en 14 áreas de especialidad: *Química general, Bioquímica, Fisiología, Nutrición, Microbiología, Microbiota, Metabolismo, Procesamiento, Sensorial, Toxicología y Evidencia*.
- Jerarquía tipográfica analítica con definiciones ejecutivas (`💡`), matrices comparativas de datos, fórmulas químicas y visores 3D moleculares (MolView).

### 3. Monografías Toxicológicas de Ingredientes y Aditivos
- Fichas de evaluación toxicológica: números INS / E, Ingesta Diaria Admisible (IDA / ADI), mecanismos de acción tecnológica y estatus normativo comparado.

### 4. Laboratorio Computacional Interactivo
- **Calculadora de Sellos Frontales de Advertencia (Colombia):** Implementación exacta de la **Resolución 810 de 2021** y **Resolución 2492 de 2022** (cálculo de umbrales energéticos para azúcares añadidos, grasas saturadas, grasas trans, sodio en mg/kcal y edulcorantes, con renderizado de octágonos negros en SVG).
- **Calculadora Energética de Atwater:** Factores metabolizables 4-4-9-2-7 kcal/g con distribución macronutricional en vivo y presets de alimentos reales.
- **Simulador de Cinética Térmica y Esterilización:** Modelado de valores $D_{121.1}$, $z$ y letalidad acumulada $F_0$ para el estándar botulínico 12D de *Clostridium botulinum*.
- **Explorador de Rutas Químicas:** Fórmulas y etapas de la Reacción de Maillard, Peroxidación Lipídica y Caramelización.
- **Expedientes de Laboratorio Forense:** 10 casos prácticos de auditoría de formulaciones y etiquetas.

### 5. Detector de Mitos y Escala de Evidencia
- Evaluación de controversias nutricionales basada en la escala de 7 niveles: `〔Establecido〕`, `〔Sólido〕`, `〔Limitado〕`, `〔Contradictorio〕`, `〔Hipótesis〕`, `〔Opinión〕`, `〔Marketing〕`.

### 6. Marco Regulatorio Comparado
- Análisis jurídico y técnico entre **Colombia (INVIMA / MinSalud)**, **Codex Alimentarius (FAO/OMS)**, **Unión Europea (EFSA)** y **Estados Unidos (US FDA)**.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Estilos:** Tailwind CSS v4 con arquitectura Dual Theme (*Dark Lab* y *Editorial Light*)
- **Interactividad:** Lucide Icons, Canvas Confetti, Web Audio API sintetizador táctil
- **Despliegue:** Docker multi-stage build con salida standalone y Docker Compose

---

## 🚀 Instalación y Despliegue Local

### Requisitos previos
- Node.js 20+
- npm 10+

### Ejecución en desarrollo
```bash
npm install
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) en el navegador.

### Compilación para producción
```bash
npm run build
npm run start
```

### Despliegue con Docker
```bash
docker compose up -d --build
```
La aplicación se expondrá en el puerto configurado (por defecto `3300:3000`).

---

## 👤 Autor

**Jhon Jairo Cruz Jiménez**  
Proyecto científico y educativo sin ánimo de lucro orientado a la alfabetización científica.
