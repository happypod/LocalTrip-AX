---
name: Modern Travel Platform
colors:
  surface: '#f4fafd'
  surface-dim: '#d4dbdd'
  surface-bright: '#f4fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f7'
  surface-container: '#e8eff1'
  surface-container-high: '#e2e9ec'
  surface-container-highest: '#dde4e6'
  on-surface: '#161d1f'
  on-surface-variant: '#584140'
  inverse-surface: '#2b3234'
  inverse-on-surface: '#ebf2f4'
  outline: '#8c706f'
  outline-variant: '#e0bfbd'
  surface-tint: '#ae2f34'
  primary: '#ae2f34'
  on-primary: '#ffffff'
  primary-container: '#ff6b6b'
  on-primary-container: '#6d0010'
  inverse-primary: '#ffb3b0'
  secondary: '#006a65'
  on-secondary: '#ffffff'
  secondary-container: '#79f3ea'
  on-secondary-container: '#006f69'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa800'
  on-tertiary-container: '#4c3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#8c1520'
  secondary-fixed: '#7cf6ec'
  secondary-fixed-dim: '#5dd9d0'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504c'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c426'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#f4fafd'
  on-background: '#161d1f'
  surface-variant: '#dde4e6'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin: 24px
---

## Brand & Style

The brand personality of the design system is vibrant, optimistic, and effortlessly high-end. It is designed to evoke the excitement of discovery while maintaining a sense of comfort and reliability. The target audience includes modern travelers who value seamless digital experiences and curated aesthetics.

The visual style is a sophisticated blend of **Minimalism** and **Glassmorphism**. It utilizes expansive white space to let high-quality travel photography breathe, while employing translucent, frosted-glass layers for interactive elements like search bars and navigation menus. This creates a sense of depth and hierarchy that feels lightweight yet premium, mirroring the "smooth user experience" found in top-tier travel applications.

## Colors

The palette is centered around a warm Primary Coral (#FF6B6B), chosen for its inviting and energetic nature. This is balanced by a Secondary Soft Teal (#4ECDC4) which provides a refreshing contrast, often used for success states, interactive accents, or categorical "Experience" tags.

The background uses a subtle off-white to reduce eye strain, while the neutrals are deep, warm grays rather than pure black to maintain the friendly tone. Surface colors utilize varying levels of transparency to facilitate glassmorphic effects, allowing background imagery to softly bleed through the interface.

## Typography

The design system exclusively uses **Plus Jakarta Sans** for its modern, rounded, and welcoming characteristics. This font family strikes the perfect balance between professional clarity and friendly approachability.

Headlines use heavy weights (Bold to ExtraBold) with slightly tighter tracking to create a strong visual impact for destination titles. Body text is set with generous line heights to ensure readability during longer browsing sessions. Labels and tags often utilize uppercase styling or increased letter spacing to distinguish them as metadata or functional UI cues.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop, centered within the viewport, transitioning to a fluid model for mobile devices. It utilizes a 12-column grid system with generous gutters to maintain the minimalist, airy aesthetic.

Spacing follows an 8px rhythmic scale. Margins are intentionally large (24px to 48px) to prevent the UI from feeling cramped. Content blocks are separated by significant vertical padding (lg or xl) to clearly define sections like "Recommended Stays" or "Popular Experiences," allowing the user to scan content without cognitive overload.

## Elevation & Depth

Hierarchy is established through a combination of **Glassmorphism** and **Ambient Shadows**. 

1. **Glassmorphic Layers:** Primary navigation and search bars use a 20px backdrop blur with a 10% white tint. A thin, 1px semi-transparent white border is applied to these elements to define their edges against complex photographic backgrounds.
2. **Ambient Shadows:** Interactive cards use extremely soft, diffused shadows (Blur: 30px, Y: 10px, Opacity: 8%) with a slight tint of the primary coral color to make them appear as if they are floating gently above the surface. 
3. **Tonal Stacking:** Less critical background elements use subtle tonal shifts (e.g., a light gray surface on a white background) rather than shadows to keep the interface clean.

## Shapes

The shape language is defined by **Rounded** geometry. A base radius of 0.5rem (8px) is used for smaller elements like buttons and input fields. Larger containers, such as property cards and promotional banners, utilize a more "generous" radius (1rem to 1.5rem) to reinforce the friendly and modern tone. 

Interactive indicators, like category chips or "Heart" favoriting buttons, may use pill-shaped (fully rounded) radii to stand out as distinct touch targets.

## Components

**Buttons:** 
Primary buttons are pill-shaped or highly rounded, using a vibrant Coral gradient. They feature a subtle lift effect on hover using an increased shadow spread. Secondary buttons use the Teal accent or a ghost-style with a 2px border.

**Cards:** 
Cards are the core of the platform. They feature a large image area with a 1rem top border radius. Content below the image is padded generously. Floating tags (e.g., "STAY", "EXPERIENCE") are placed in the top-left corner of images using high-contrast backgrounds and rounded corners.

**Search Bar:** 
The central search component is a prominent glassmorphic element. It features large, rounded input fields with clear icons and a high-contrast coral "Search" button.

**Chips & Tags:** 
Used for categories and filtering, these use soft pastel backgrounds derived from the primary and secondary colors with high-contrast text.

**Input Fields:** 
Softly rounded with a light gray fill and a subtle coral border that appears only on focus to guide the user.

**Lists:** 
Vertical lists for search results or itineraries use generous internal padding and thin, low-opacity separators to maintain a sense of lightness.