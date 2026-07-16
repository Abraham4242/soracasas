/* ════════════════════════════════════════════════════════════════════
   SORA Casas · Materials Encyclopedia — sourced reference data
   Loaded by sorainternalresources.html's "Enciclopedia de Materiales" tab.

   Every prevalence figure below is either:
   (a) computed directly from a primary government census table (Panama
       2023, Peru 2017 — both hand-verified against the actual published
       PDF/data, arithmetic shown in commit history), or
   (b) a named industry/association benchmark (US NAHB, IDB), clearly
       dated, or
   (c) explicitly marked "sin dato" (no reliable figure found) rather
       than guessed. Costa Rica, Colombia, and Ecuador have real, usable
       census questions on this exact topic but the published results
       tables with percentages were not locatable as of July 2026 —
       treat those gaps as "not yet found," not "confirmed absent," and
       revisit if INEC/DANE publish more granular tables later.

   Research pass: July 2026. See project memory / STATE notes for the
   full research trail (deep-research workflow + direct INEC PDF pulls).
   ════════════════════════════════════════════════════════════════════ */

window.SORA_MATERIALS = [

/* ============================= ESTRUCTURA ============================= */

{slug:'concrete-block-rebar',kind:'structural',category:'Estructura',subcategory:'Muros',
 name:{es:'Bloque de concreto + varilla',en:'Concrete block + rebar'},
 desc:{es:'Bloque de concreto (o ladrillo/piedra) relleno con varilla vertical de refuerzo. El sistema de paredes más común en Panamá y gran parte de Latinoamérica, por costo, disponibilidad y resistencia sísmica.',
       en:'Concrete block (or brick/stone) filled with vertical steel rebar. The most common wall system in Panama and much of Latin America, for cost, availability, and seismic performance.'},
 swatches:['#9a958a'],
 prevalence:[
   {country:'PA',pct:88.4,source:'INEC Panamá, XII Censo Nacional de Población y VIII de Vivienda, Cuadro 12 (categoría "Bloque, ladrillo, piedra, concreto")',year:2023},
   {country:'PE',pct:55.8,source:'INEI Perú, Censo Nacional 2017, Cuadro N° 1.9 (categoría "ladrillo o bloque de cemento")',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada verificada — dominante en zonas sísmicas/tropicales de LatAm, mucho menos común en Norteamérica y norte de Europa (ver marco de madera).',year:2026},
 soraMarkets:['PA'],tiers:['esencial','sora','firma'],
 notes:{es:'Panamá y Perú agrupan bloque + ladrillo + piedra en una sola categoría censal, así que esta cifra representa el "sistema de mampostería" en conjunto, no solo bloque.',en:'Panama and Peru both group block + brick + stone into one census category, so this figure represents the whole "masonry system," not block alone.'}},

{slug:'cast-concrete-frame',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Marco de concreto colado (columnas y vigas)',en:'Cast-in-place concrete frame (columns & beams)'},
 desc:{es:'Estructura de columnas y vigas de concreto reforzado colado en sitio, con losa de concreto como techo/entrepiso. Común en construcción de gama alta y edificios de varios niveles.',
       en:'Reinforced concrete columns and beams poured on site, with a concrete slab as roof/floor. Common in higher-end homes and multi-story buildings.'},
 swatches:['#b0aca2'],
 prevalence:[
   {country:'PA',pct:7.5,source:'INEC Panamá, Censo 2023, Cuadro 12 — proxy: % de viviendas con techo de "losa de concreto" (indicador de estructura de concreto colado, no de marco vs. muro de carga)',year:2023},
   {country:'PE',pct:42.8,source:'INEI Perú, Censo 2017, Cuadro N° 1.17 — % de viviendas con techo de "concreto armado"',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global verificada.',year:2026},
 soraMarkets:['PA'],tiers:['firma'],
 notes:{es:'La cifra de Panamá usa el material del techo (losa de concreto) como indicador indirecto, ya que el censo no distingue marco estructural de muro de carga directamente.',en:"Panama's figure uses roof material (concrete slab) as an indirect proxy, since the census doesn't directly distinguish a structural frame from load-bearing walls."}},

{slug:'light-wood-frame',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Marco de madera liviana (2x4/2x6)',en:'Light wood-stud frame (2x4/2x6)'},
 desc:{es:'Estructura de madera aserrada tipo "stick frame", forrada y aislada. El sistema dominante en EE.UU. y Canadá. Sora no construye así hoy — referencia global para comparar.',
       en:"Dimensional-lumber stick framing, sheathed and insulated. The dominant system in the US and Canada. Sora doesn't build this way today — a global reference point for comparison."},
 swatches:['#c9a06a'],
 prevalence:[
   {country:'PA',pct:7.4,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría de paredes "Madera (tablas o troza)" — incluye toda construcción de madera, no solo marco liviano tipo 2x4)',year:2023},
   {country:'PE',pct:9.5,source:'INEI Perú, Censo 2017, Cuadro N° 1.9 (categoría de paredes "madera")',year:2017}
 ],
 globalPct:{value:93.5,source:'NAHB / U.S. Census Bureau Survey of Construction — % de casas unifamiliares nuevas en EE.UU. con marco de madera (93% en 2023, 94% en 2024)',year:2024},
 soraMarkets:[],tiers:[],
 notes:{es:'Las cifras de Panamá y Perú son para TODA construcción de madera (paredes de tablas/troza), no específicamente marco liviano tipo 2x4 — probablemente sobreestiman el marco liviano como tal frente a construcción de madera maciza/rústica.',en:'The Panama and Peru figures are for ALL wood-wall construction (plank/log), not specifically light 2x4-style stud framing — likely an overestimate of light framing versus solid/rustic wood construction.'}},

{slug:'heavy-timber-frame',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Marco pesado de madera (poste y viga)',en:'Heavy timber post-and-beam framing'},
 desc:{es:'Postes y vigas de madera maciza de gran sección, sin relleno de paneles livianos. Sistema tradicional en construcción rural y de montaña en varias partes de Latinoamérica, y en cabañas/lodges de alta gama.',
       en:'Large-section solid timber posts and beams, without light panel infill. A traditional system in rural and mountain construction across parts of Latin America, and in higher-end cabins/lodges.'},
 swatches:['#8a6238'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra confiable encontrada — los censos nacionales no distinguen marco pesado de madera de otra construcción de madera.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'Ningún censo de los países cubiertos desagrega esta categoría por separado; se incluye aquí como referencia cualitativa, no cuantitativa.',en:"None of the covered countries' censuses break this category out separately; included here as a qualitative, not quantitative, reference."}},

{slug:'light-gauge-steel-frame',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Marco de acero galvanizado liviano',en:'Light-gauge steel frame'},
 desc:{es:'Perfiles de acero galvanizado en vez de madera o concreto. Rápido de montar, resistente a termitas, poco usado en vivienda residencial en Latinoamérica.',
       en:'Galvanized steel studs instead of wood or concrete. Fast to erect, termite-proof, rarely used in Latin American residential construction.'},
 swatches:['#8a94a0'],
 prevalence:[],
 globalPct:{value:0.5,source:'NAHB / U.S. Census Bureau Survey of Construction — % de casas unifamiliares nuevas en EE.UU. con marco de acero, menor al 0.5%',year:2024},
 soraMarkets:[],tiers:[],
 notes:{es:'Sin cifra específica de Panamá, Costa Rica, Colombia, Ecuador o Perú — no aparece como categoría separada en los censos revisados.',en:'No specific Panama/Costa Rica/Colombia/Ecuador/Peru figure — it does not appear as a separate category in the censuses reviewed.'}},

{slug:'structural-steel-frame',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Marco de acero estructural pesado',en:'Heavy structural steel frame'},
 desc:{es:'Vigas y columnas de acero de sección pesada (I-beam), típico de edificios comerciales o industriales, poco común en vivienda unifamiliar.',
       en:'Heavy-section steel beams and columns (I-beams), typical of commercial or industrial buildings, uncommon in single-family housing.'},
 swatches:['#5c6670'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra confiable encontrada para vivienda residencial específicamente.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'Incluido como referencia; no es un sistema relevante para vivienda unifamiliar en los mercados de Sora.',en:"Included for reference; not a relevant system for single-family housing in Sora's markets."}},

{slug:'adobe-rammed-earth',kind:'structural',category:'Estructura',subcategory:'Muros',
 name:{es:'Adobe / tierra apisonada (tapia)',en:'Adobe / rammed earth (tapia)'},
 desc:{es:'Bloques de barro secados al sol (adobe) o tierra compactada en moldes (tapia). Sistema tradicional precolombino, en declive frente a la mampostería moderna, pero con renovado interés por su desempeño térmico y sostenibilidad.',
       en:'Sun-dried mud blocks (adobe) or earth compacted in forms (rammed earth/tapia). A traditional pre-Columbian system, declining against modern masonry, but with renewed interest for thermal performance and sustainability.'},
 swatches:['#b08256'],
 prevalence:[
   {country:'PE',pct:27.9,source:'INEI Perú, Censo Nacional 2017, Cuadro N° 1.9 (categoría "adobe o tapia")',year:2017},
   {country:'PA',pct:0.65,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Quincha o adobe")',year:2023}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada — significativo en la región andina, marginal en Centroamérica costera.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'En Perú, las viviendas de adobe/tapia cayeron 3.6% entre los censos de 2007 y 2017, mientras que el bloque/ladrillo creció 43.7% — una transición nacional documentada de tierra a mampostería.',en:'In Peru, adobe/rammed-earth dwellings fell 3.6% between the 2007 and 2017 censuses while brick/block grew 43.7% — a documented national shift from earthen to masonry construction.'}},

{slug:'guadua-bamboo',kind:'structural',category:'Estructura',subcategory:'Marco',
 name:{es:'Guadua (bambú estructural)',en:'Guadua (structural bamboo)'},
 desc:{es:'Bambú Guadua angustifolia, usado como sistema estructural formal en Colombia. Tras el sismo de Armenia de 1999 (Mw 6.2), las estructuras de bahareque-guadua tuvieron mejor desempeño que la mampostería/concreto, lo que llevó a su codificación en un capítulo dedicado (Título G, Capítulo G.12) del código sísmico colombiano NSR-10.',
       en:'Guadua angustifolia bamboo, used as a formal structural system in Colombia. After the 1999 Armenia earthquake (Mw 6.2), bahareque-guadua structures outperformed masonry/concrete, leading to a dedicated chapter (Título G, Capítulo G.12) in Colombia\'s NSR-10 seismic code.'},
 swatches:['#8fae5c'],
 prevalence:[],
 globalPct:{value:null,source:'Sin porcentaje nacional o regional verificado de adopción — el hecho regulatorio (código NSR-10) está confirmado, pero ninguna fuente encontrada cuantifica qué % de vivienda colombiana lo usa.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'Tratar como dato cualitativo/regulatorio únicamente. Ninguna fuente (incluyendo estudios académicos dedicados al tema) reportó una cifra de prevalencia confiable.',en:'Treat as qualitative/regulatory only. No source found (including academic studies dedicated to the topic) reported a reliable prevalence figure.'}},

{slug:'palm-cane-vernacular-walls',kind:'structural',category:'Estructura',subcategory:'Muros',
 name:{es:'Palma, caña y bambú (construcción vernácula)',en:'Palm, cane & bamboo (vernacular construction)'},
 desc:{es:'Paredes de palma, paja, penca, cañaza o bambú sin tratamiento estructural formal. Tradición constructiva indígena y rural, hoy minoritaria pero presente, especialmente en comarcas.',
       en:'Walls of palm, straw, cane, or untreated bamboo. An indigenous and rural building tradition, now a minority share but still present, especially in indigenous territories.'},
 swatches:['#d4c48a'],
 prevalence:[{country:'PA',pct:1.1,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Palma, paja, penca, cañaza, bambú o palos")',year:2023}],
 globalPct:{value:null,source:'Sin cifra global verificada.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'',en:''}},

/* ============================== ACABADOS ============================== */

{slug:'metal-roofing',kind:'finish',category:'Acabados',subcategory:'Techo',
 name:{es:'Techo de lámina metálica (zinc/aluminio)',en:'Metal panel roofing (zinc/aluminum)'},
 desc:{es:'Lámina de zinc o aluminio-zinc, corrugada o de costura vertical. El material de techo dominante en Panamá por su bajo costo, ligereza y durabilidad frente a la lluvia tropical.',
       en:'Corrugated or standing-seam zinc/aluminum-zinc panel. The dominant roofing material in Panama for its low cost, light weight, and durability against tropical rain.'},
 swatches:['#5c6670'],
 prevalence:[
   {country:'PA',pct:82.3,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría de techo "Metal (zinc, aluminio, entre otros)")',year:2023},
   {country:'PE',pct:39.2,source:'INEI Perú, Censo 2017, Cuadro N° 1.17 (categoría "calamina o fibra de cemento" — nota: agrupa metal con fibrocemento)',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada — dominante en la mayoría de la región tropical/costera de LatAm.',year:2026},
 soraMarkets:['PA'],tiers:['esencial','sora','firma'],
 notes:{es:'El censo peruano agrupa metal y fibra de cemento en una sola categoría de techo, así que el 39.2% no es comparable uno a uno con el 82.3% de Panamá, que es solo metal.',en:"Peru's census groups metal and fiber-cement into one roofing category, so its 39.2% is not directly comparable to Panama's 82.3%, which is metal only."}},

{slug:'concrete-slab-roof',kind:'finish',category:'Acabados',subcategory:'Techo',
 name:{es:'Losa de concreto (techo plano)',en:'Concrete slab roof (flat roof)'},
 desc:{es:'Techo/entrepiso de concreto colado, plano o con mínima pendiente, a menudo usado como terraza. Común en construcción de gama alta y en climas donde se busca masa térmica.',
       en:'Poured concrete roof/deck, flat or minimal slope, often used as a rooftop terrace. Common in higher-end construction and climates where thermal mass is valued.'},
 swatches:['#b0aca2'],
 prevalence:[
   {country:'PA',pct:7.5,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Losa de concreto")',year:2023},
   {country:'PE',pct:42.8,source:'INEI Perú, Censo 2017, Cuadro N° 1.17 (categoría "concreto armado")',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:['PA'],tiers:['firma'],
 notes:{es:'La cifra alta de Perú probablemente refleja más construcción urbana multinivel donde la losa de concreto sirve de piso al nivel superior, no solo techo final.',en:"Peru's high figure likely reflects more urban multi-story construction where the concrete slab serves as the upper floor, not just a final roof."}},

{slug:'fiber-cement-composite-roofing',kind:'finish',category:'Acabados',subcategory:'Techo',
 name:{es:'Panel compuesto (tejalit, panalit, techolit)',en:'Composite fiber-cement panel roofing'},
 desc:{es:'Paneles livianos de fibrocemento u otros compuestos, con apariencia de teja. Una categoría propia y significativa en el censo panameño, alternativa intermedia entre lámina metálica y teja de barro tradicional.',
       en:'Lightweight fiber-cement or composite panels styled to look like tile. Its own significant census category in Panama, a middle option between metal panel and traditional clay tile.'},
 swatches:['#9c8f7e'],
 prevalence:[{country:'PA',pct:6.6,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Otro tipo de teja (tejalit, panalit, techolit, entre otras)")',year:2023}],
 globalPct:{value:null,source:'Sin cifra global verificada — categoría específica del censo panameño, no reportada de forma comparable en otros países revisados.',year:2026},
 soraMarkets:['PA'],tiers:['sora','firma'],
 notes:{es:'',en:''}},

{slug:'clay-tile-roofing',kind:'finish',category:'Acabados',subcategory:'Techo',
 name:{es:'Teja de barro / arcilla',en:'Clay tile roofing'},
 desc:{es:'Teja de arcilla cocida, tradicional en zonas coloniales de Latinoamérica y en el Mediterráneo. Más pesada y cara que la lámina metálica, valorada por su estética y desempeño térmico.',
       en:'Fired clay tile, traditional in colonial-era Latin American zones and across the Mediterranean. Heavier and pricier than metal panel roofing, valued for aesthetics and thermal performance.'},
 swatches:['#a85c3c'],
 prevalence:[
   {country:'PA',pct:2.3,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Teja")',year:2023},
   {country:'PE',pct:7.8,source:'INEI Perú, Censo 2017, Cuadro N° 1.17 (categoría "tejas")',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:[],tiers:['firma'],
 notes:{es:'',en:''}},

{slug:'thatch-palm-roofing',kind:'finish',category:'Acabados',subcategory:'Techo',
 name:{es:'Techo de palma / paja / penca',en:'Thatch / palm roofing'},
 desc:{es:'Techo de materiales vegetales (palma, paja, penca), tradición indígena y rural. Minoritario a nivel nacional pero significativo en comarcas y zonas rurales aisladas; también usado deliberadamente en arquitectura turística/lodge por su estética.',
       en:'Roofing made of plant materials (palm, straw, thatch), an indigenous and rural tradition. A national minority but significant in indigenous territories and isolated rural zones; also used deliberately in tourism/lodge architecture for its look.'},
 swatches:['#c9b877'],
 prevalence:[
   {country:'PA',pct:1.2,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Palma, paja o penca")',year:2023},
   {country:'PE',pct:2.9,source:'INEI Perú, Censo 2017, Cuadro N° 1.17 (categoría "estera" combinada con techos de caña/hoja)',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'',en:''}},

{slug:'stucco-render-paint',kind:'finish',category:'Acabados',subcategory:'Envolvente',
 name:{es:'Repello y pintura (estuco)',en:'Stucco render + paint'},
 desc:{es:'Repello de mortero sobre bloque o concreto, pintado. El acabado exterior estándar sobre estructura de bloque en Panamá y buena parte de Latinoamérica.',
       en:'Mortar render over block or concrete, then painted. The standard exterior finish over block structures in Panama and much of Latin America.'},
 swatches:['#e8e2d0'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra cuantificada — los censos revisados registran el material ESTRUCTURAL de la pared (bloque, madera, etc.), no el acabado/revestimiento aplicado encima, así que no existe una tabla censal equivalente para este dato.',year:2026},
 soraMarkets:['PA'],tiers:['esencial','sora','firma'],
 notes:{es:'Dato cualitativo importante: como el estuco es un acabado SOBRE la pared estructural (no la pared misma), ningún censo nacional lo cuantifica por separado. Se estima informalmente casi universal sobre bloque en Panamá, pero sin cifra oficial.',en:"Important qualitative note: since stucco is a finish OVER the structural wall (not the wall itself), no national census tracks it separately. Informally estimated as near-universal over block in Panama, but with no official figure."}},

{slug:'exposed-concrete-finish',kind:'finish',category:'Acabados',subcategory:'Envolvente',
 name:{es:'Concreto expuesto',en:'Exposed concrete finish'},
 desc:{es:'Concreto dejado sin repello ni pintura como acabado arquitectónico deliberado. Tendencia de diseño contemporáneo, minoritaria en vivienda tradicional.',
       en:'Concrete left unrendered and unpainted as a deliberate architectural finish. A contemporary design trend, a minority choice in traditional housing.'},
 swatches:['#a8a49b'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra encontrada — es una elección de diseño, no una categoría censal.',year:2026},
 soraMarkets:[],tiers:['firma'],
 notes:{es:'',en:''}},

{slug:'fiber-cement-siding',kind:'finish',category:'Acabados',subcategory:'Envolvente',
 name:{es:'Revestimiento de fibrocemento',en:'Fiber cement siding'},
 desc:{es:'Paneles o tablas de fibrocemento como revestimiento exterior, alternativa a la madera con menor mantenimiento y mejor resistencia a la humedad.',
       en:'Fiber-cement panels or planks as exterior cladding, a lower-maintenance, more moisture-resistant alternative to wood siding.'},
 swatches:['#c4beb2'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra confiable encontrada específica para revestimiento (independiente del material estructural de pared).',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'',en:''}},

{slug:'wood-siding',kind:'finish',category:'Acabados',subcategory:'Envolvente',
 name:{es:'Revestimiento de madera',en:'Wood siding'},
 desc:{es:'Tablas de madera como revestimiento exterior, ya sea sobre estructura de madera o como capa decorativa sobre otra estructura.',
       en:'Wood planks as exterior cladding, either over a wood structure or as a decorative layer over another structural system.'},
 swatches:['#a97c4f'],
 prevalence:[],
 globalPct:{value:null,source:'Sin cifra confiable encontrada específica para revestimiento (independiente del material estructural de pared).',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'',en:''}},

{slug:'tile-flooring',kind:'finish',category:'Acabados',subcategory:'Piso',
 name:{es:'Piso de mosaico / porcelanato',en:'Tile / porcelain flooring'},
 desc:{es:'Piso de mosaico, baldosa, mármol o parqué cerámico. El piso más común en Panamá, presente en todos los niveles de acabado (Esencial usa cerámica local, Firma usa porcelanato importado).',
       en:"Mosaic, tile, marble, or ceramic parquet flooring. Panama's most common floor, present at every finish tier (Esencial uses local ceramic, Firma uses imported porcelain)."},
 swatches:['#d8d2c4'],
 prevalence:[{country:'PA',pct:56.6,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Piso de mosaico o baldosas, mármol y parqué")',year:2023}],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:['PA'],tiers:['esencial','sora','firma'],
 notes:{es:'',en:''}},

{slug:'concrete-flooring',kind:'finish',category:'Acabados',subcategory:'Piso',
 name:{es:'Piso de concreto pavimentado',en:'Poured/finished concrete flooring'},
 desc:{es:'Piso de concreto pavimentado sin cubierta adicional. Económico y funcional, común en construcción básica y en espacios de servicio/exteriores.',
       en:'Poured concrete floor with no additional covering. Economical and functional, common in basic construction and service/outdoor spaces.'},
 swatches:['#b5b0a6'],
 prevalence:[
   {country:'PA',pct:34.9,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Piso pavimentado (concreto)")',year:2023},
   {country:'PE',pct:42.2,source:'INEI Perú, Censo 2017, Cuadro N° 1.9-anexo (categoría "cemento")',year:2017}
 ],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:['PA'],tiers:['esencial'],
 notes:{es:'',en:''}},

{slug:'dirt-floor',kind:'finish',category:'Acabados',subcategory:'Piso',
 name:{es:'Piso de tierra',en:'Dirt (unfinished) floor'},
 desc:{es:'Vivienda sin ningún tipo de piso mejorado; la tierra queda en su estado natural. Indicador estándar de vivienda precaria usado por censos e instituciones de desarrollo regional.',
       en:'A dwelling with no improved floor at all; the earth remains in its natural state. A standard substandard-housing indicator used by censuses and regional development institutions.'},
 swatches:['#6b5642'],
 prevalence:[
   {country:'PA',pct:5.4,source:'INEC Panamá, Censo 2023, Cuadro 12 / resultados básicos oficiales (categoría "Piso de tierra")',year:2023},
   {country:'PE',pct:31.8,source:'INEI Perú, Censo 2017, Cuadro N° 1.9-anexo (categoría "tierra")',year:2017}
 ],
 globalPct:{value:6,source:'BID (IDB) — estimado regional de LatAm y el Caribe, "Room for Development" (2012); dato de encuesta de ~2009-2012, no actual',year:2012},
 soraMarkets:[],tiers:[],
 notes:{es:'La cifra del BID es regional (LatAm/Caribe) y tiene más de una década de antigüedad — usar como referencia histórica, no como dato actual.',en:"The IDB figure is regional (LatAm/Caribbean) and over a decade old — use as historical context, not a current figure."}},

{slug:'wood-flooring',kind:'finish',category:'Acabados',subcategory:'Piso',
 name:{es:'Piso de madera',en:'Wood flooring'},
 desc:{es:'Piso de madera maciza o parqué. Menos común que la cerámica en climas tropicales húmedos por el mantenimiento que requiere.',
       en:'Solid wood or parquet flooring. Less common than ceramic in humid tropical climates because of the upkeep it requires.'},
 swatches:['#a97c4f'],
 prevalence:[{country:'PA',pct:2.9,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Piso de madera")',year:2023}],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:[],tiers:['firma'],
 notes:{es:'',en:''}},

{slug:'brick-flooring',kind:'finish',category:'Acabados',subcategory:'Piso',
 name:{es:'Piso de ladrillo',en:'Brick flooring'},
 desc:{es:'Piso de ladrillo de arcilla, hoy marginal en vivienda nueva, usado más en patios y espacios exteriores con intención decorativa.',
       en:'Clay brick flooring, marginal in new housing today, used more in patios and outdoor spaces for decorative effect.'},
 swatches:['#8a4a35'],
 prevalence:[{country:'PA',pct:0.06,source:'INEC Panamá, Censo 2023, Cuadro 12 (categoría "Piso de ladrillo")',year:2023}],
 globalPct:{value:null,source:'Sin cifra global agregada.',year:2026},
 soraMarkets:[],tiers:[],
 notes:{es:'',en:''}},

{slug:'vinyl-pvc-windows',kind:'finish',category:'Acabados',subcategory:'Ventanas/Puertas',
 name:{es:'Ventanas de PVC/vinilo',en:'PVC/vinyl windows'},
 desc:{es:'Marcos de PVC, valorados por su aislamiento térmico y bajo mantenimiento. Dominante en EE.UU.; su adopción específica en Panamá/Costa Rica/Latinoamérica no está cuantificada en las fuentes revisadas.',
       en:'PVC frames, valued for thermal insulation and low maintenance. Dominant in the US; specific adoption in Panama/Costa Rica/Latin America is not quantified in the sources reviewed.'},
 swatches:['#e8e6df'],
 prevalence:[],
 globalPct:{value:68,source:'Home Innovation Research Labs / WDMA Builder Practices Survey — % de ventanas nuevas en EE.UU. con marco de vinilo, subiendo de 51% (2005) a 68%',year:2017},
 soraMarkets:[],tiers:[],
 notes:{es:'Dato de EE.UU. únicamente (2017, la encuesta más reciente encontrada) — no asumir que aplica a Latinoamérica, donde el aluminio suele ser el estándar por clima tropical y costo.',en:'US-only data (2017, the most recent survey found) — do not assume it applies to Latin America, where aluminum is typically the default given tropical climate and cost.'}},

{slug:'aluminum-windows',kind:'finish',category:'Acabados',subcategory:'Ventanas/Puertas',
 name:{es:'Ventanas de aluminio',en:'Aluminum windows'},
 desc:{es:'Marcos de aluminio, el estándar en Panamá y buena parte de Latinoamérica tropical por su resistencia a la humedad, bajo costo y disponibilidad local, frente al PVC (más caro de importar) y la madera (requiere más mantenimiento).',
       en:'Aluminum frames, the default in Panama and much of tropical Latin America for moisture resistance, low cost, and local availability, versus PVC (pricier to import) and wood (higher maintenance).'},
 swatches:['#b7bcc2'],
 prevalence:[],
 globalPct:{value:7,source:'Home Innovation Research Labs / WDMA — % de ventanas nuevas en EE.UU. con marco de aluminio, cayendo de ~25% (2005-06) a ~7% (2017)',year:2017},
 soraMarkets:['PA'],tiers:['esencial','sora','firma'],
 notes:{es:'La cifra global es de EE.UU., donde el aluminio está en declive — la situación es inversa en Panamá/LatAm tropical, donde el aluminio sigue siendo el estándar. Tratar el dato de Sora sobre esto como conocimiento de la industria local, no una cifra censal.',en:"The global figure is from the US, where aluminum is declining — the situation is reversed in tropical Panama/LatAm, where aluminum remains the standard. Treat Sora's claim here as local industry knowledge, not a census figure."}},

{slug:'wood-windows',kind:'finish',category:'Acabados',subcategory:'Ventanas/Puertas',
 name:{es:'Ventanas de madera',en:'Wood windows'},
 desc:{es:'Marcos de madera, valorados estéticamente pero con mayor mantenimiento en climas húmedos tropicales. Minoritario frente al aluminio en Panamá.',
       en:'Wood frames, valued aesthetically but higher-maintenance in humid tropical climates. A minority choice against aluminum in Panama.'},
 swatches:['#8a6238'],
 prevalence:[],
 globalPct:{value:5.5,source:'Home Innovation Research Labs / WDMA — % de ventanas nuevas en EE.UU. con marco de madera sin revestimiento, estable en ~5-6%',year:2017},
 soraMarkets:[],tiers:['firma'],
 notes:{es:'',en:''}}

];
