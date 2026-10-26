# Prototipo SEO/GEO – B.E.G. Luxomat España (propuesta)

Prototipo estático de la web `/es/` de B.E.G. con las mejoras de la auditoría (26-oct-2026) aplicadas.
**No es la web oficial de B.E.G.** Lo ha generado el consultor como propuesta. Textos y datos técnicos
reutilizados de beg-luxomat.com. Donde falta un dato, aparece el marcador visible
`[dato a confirmar por el cliente]`.

Se genera con `scripts/build_proto.py` (los datos vienen de `scripts/proto_data.py` y de `raw/proto/`).

```
python3 scripts/build_proto.py                       # prototipo (noindex + franja + robots Disallow)
python3 scripts/build_proto.py --prod --out /tmp/x   # variante "producción", SOLO para medir Lighthouse
python3 scripts/qa_proto.py                          # QA -> prototype_qa/
```

## Qué QUITAR o CAMBIAR antes de llevarlo a producción
1. **Franja** `<div class="proto">Prototipo de propuesta SEO/GEO…</div>`, en todas las páginas.
2. **`<meta name="robots" content="noindex, nofollow">`**, en todas las páginas (`--prod` ya lo elimina).
3. **`robots.txt` de despliegue** (`Disallow: /`): sustituirlo por `robots.produccion.txt`, que
   permite los buscadores y bots de IA (M11) y bloquea la plantilla vacía `/es/productos/detalles/` (M03).
4. **BASE**: canonical, og:url, hreflang y sitemap usan `https://www.beg-luxomat.com` (`--base`).
   El prototipo usa enlaces internos relativos y funciona en cualquier host.
5. **Redirecciones 301** desde las URLs actuales hacia la nueva arquitectura anidada (M12/M14):
   - `/es/productos/detalles/PD4N-BMS-DALI-2-93546/` → `/es/productos/detectores-de-presencia-y-movimiento/detectores-de-presencia-para-techo/pd4n-bms-dali-2-93546/`
   - `/es/productos/detalles/PD4N-M-DACO-DALI-2-93460/` → `…/detectores-de-presencia-para-techo/pd4n-m-daco-dali-2-93460/`
   - `/es/productos/detalles/PD4N-KNXs-ST-FT-93514/` → `…/detectores-de-presencia-para-techo/pd4n-knxs-st-ft-93514/`
   - Calculadora 404 actual → `/es/herramientas/calculadora-de-ahorro-energetico/` (M04)
   - Alternativa sin migrar URLs: mantener `/detalles/X/` y aplicar solo las mejoras on-page y de schema.
6. **hreflang recíproco**: las páginas EN/DE/FR de producción deben enlazar de vuelta a la URL `es-ES`;
   si no, Google ignora la anotación. `x-default` apunta al equivalente `/en/` (M02), no a `/en-in/`.
7. **Marcadores `[dato a confirmar por el cliente]`**: resolverlos o retirar la frase.
8. **Product schema sin `offers` ni `review`**: es schema.org válido, pero sin precio ni valoraciones
   Google no muestra el fragmento enriquecido de producto. No se han inventado precios ni reseñas.
   Si B.E.G. publica un PVP o reseñas reales, se pueden añadir.
9. Enlaces a categorías no incluidas en el prototipo: apuntan a la web oficial.
10. `404.html` usa rutas absolutas (`/es/`): pensado para servirse en la raíz del dominio.

## Páginas
| URL | Tipo | Schema |
|---|---|---|
| /es/ | Home | Organization, Organization+LocalBusiness (Hispania), WebSite, WebPage |
| /es/productos/ | Hub de productos | CollectionPage, ItemList, BreadcrumbList |
| /es/productos/detectores-de-presencia-y-movimiento/detectores-de-presencia-para-techo/ | Categoría (DALI-2 / KNX / 230 V) | CollectionPage, ItemList, FAQPage, BreadcrumbList |
| …/pd4n-bms-dali-2-93546/, …/pd4n-m-daco-dali-2-93460/, …/pd4n-knxs-st-ft-93514/ | Ficha de producto | Product, FAQPage, BreadcrumbList, ItemPage, Organization |
| /es/soluciones/industrias/ (+ edificio-administrativo, hospitales-y-centros-sanitarios [NUEVA], industria-y-logistica, hoteles) | Sectores | WebPage/CollectionPage, BreadcrumbList |
| /es/empresa/conoce-beg/ | Sobre B.E.G. (E-E-A-T) | Organization, AboutPage, sameAs |
| /es/contacto/ | Contacto (NAP) | Organization, Organization+LocalBusiness (addressCountry ES) + delegación Madrid |
| /es/guias/, /es/guias/como-elegir-un-detector-de-presencia/ | Guía citable | TechArticle, FAQPage |
| /es/herramientas/calculadora-de-ahorro-energetico/ | Calculadora | WebApplication |
| /robots.txt, /robots.produccion.txt, /sitemap.xml, /llms.txt | Técnicos | — |

## Mejoras aplicadas (IDs de `audit/mejoras.csv`)
- **Técnico:** M01/M02 hreflang + x-default · M03 robots (plantilla vacía) · M04 calculadora · M05/M06 sitemap con lastmod y solo URLs indexables · M07/M12/M13 slugs en español, coherentes y sin erratas · M09 raíz 200 con selector · M11 robots IA · M14 breadcrumb y arquitectura.
- **Rendimiento:** M18 la imagen LCP sin lazy + `fetchpriority=high` · M19 WebP 200/400 con srcset · M20 width/height (CLS) · M21 fuentes del sistema · M22 CSS inline mínimo, JS solo en la calculadora.
- **On-page:** M24–M26 titles y metas en español (≤ ~60/155) · M27 metas en español · M28/M31 un H1 limpio · M29/M33 H2 en español · M30 textos de uso · M35 tratamiento de «usted» + «alimentación» · M36 alt descriptivos · M37 nombres de archivo en español · M38 Open Graph.
- **Schema:** M39 Product · M40 Organization · M41 LocalBusiness Hispania · M42 FAQPage/ItemList · M49 WebSite.
- **Contenido:** M43 clúster por familias · M44 hospitales · M45 sectores ampliados · M46 FAQ · M47 BIM/prescripción/Generador de precios · M48 CTE DB HE 3.
- **Local:** M54 NAP unificado (a confirmar).
- **GEO:** M55 Wikidata (marcador) · M56 llms.txt · M57 guía y datos citables con fuente · M58 E-E-A-T (autoría, a confirmar).
- **Se evita:** M60, porque no se bloquean los bots de IA ni se generan páginas automáticas · M61, porque el prototipo no exige migrar de CMS.
- **No aplicables en un prototipo estático:** M08, M10, M15–M17 (servidor y redirecciones), M23 (datos de campo), M32/M34 (páginas no incluidas), M50–M53 (autoridad y GBP), M59 (citas en IA).
