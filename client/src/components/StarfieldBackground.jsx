import { useMemo } from "react"

/**
 * StarfieldBackground — renders an animated CSS starfield with nebula blobs.
 * Uses box-shadow technique for performant star rendering.
 * Sits behind all page content via position:fixed + z-index:0.
 */
const StarfieldBackground = () => {
  // Generate random star positions as box-shadow strings  
  const stars = useMemo(() => {
    const generate = (count, maxSize) => {
      let shadows = []
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 2560
        // Double height for scrolling animation  
        const y = Math.random() * 5120
        const size = Math.random() * maxSize
        const opacity = 0.4 + Math.random() * 0.6
        shadows.push(`${x}px ${y}px ${size}px rgba(200, 210, 255, ${opacity})`)
      }
      return shadows.join(", ")
    }

    return {
      small: generate(400, 1),
      medium: generate(120, 1.5),
      large: generate(40, 2.2),
    }
  }, [])

  return (
    <div className="starfield-container">
      {/* Star layers */}
      <div
        className="stars-layer stars-layer-1"
        style={{ boxShadow: stars.small, width: "1px", height: "1px" }}
      />
      <div
        className="stars-layer stars-layer-2"
        style={{ boxShadow: stars.medium, width: "1px", height: "1px" }}
      />
      <div
        className="stars-layer stars-layer-3"
        style={{ boxShadow: stars.large, width: "2px", height: "2px", borderRadius: "50%" }}
      />

      {/* Nebula gradient blobs */}
      <div className="nebula-blob nebula-1" />
      <div className="nebula-blob nebula-2" />
      <div className="nebula-blob nebula-3" />
    </div>
  )
}

export default StarfieldBackground
