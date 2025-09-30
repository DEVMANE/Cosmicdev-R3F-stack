import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }

    const checkIsMobile = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isSmallScreen || hasCoarsePointer || isTouchDevice())
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px), (pointer: coarse)`)
    const onChange = () => {
      checkIsMobile()
    }
    mql.addEventListener("change", onChange)
    checkIsMobile()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
