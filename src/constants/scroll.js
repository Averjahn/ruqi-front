export const scrollWithAnimation = ({
  root = document.documentElement,
  scrollTargetY = 0,
  speed = 2000,
  time,
  easing = 'easeOutSine',
  callback = () => {},
}) => {
  if (!root) return
  const scrollY = root?.scrollTop || 0
  const calculatedTime = Math.min(Math.abs(scrollY - scrollTargetY) / speed)
  const finalTime = time || calculatedTime
  const easingEquations = {
    easeOutExpo: function (pos) {
      return pos === 1 ? 1 : 1 - Math.pow(2, -10 * pos)
    },
    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2))
    },
    easeInOutSine: function (pos) {
      return -0.5 * (Math.cos(Math.PI * pos) - 1)
    },
    easeInOutQuint: function (pos) {
      if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(pos, 5)
      }
      return 0.5 * (Math.pow(pos - 2, 5) + 2)
    },
    easeOutElastic: function (x) {
      if (x === 0) return 0
      if (x === 1) return 1
      return (
        -2.0185 * Math.pow(x, 6) +
        19.464 * Math.pow(x, 5) -
        53.197 * Math.pow(x, 4) +
        64.751 * Math.pow(x, 3) -
        38.689 * Math.pow(x, 2) +
        10.702 * x -
        0.0122
      )
    },
  }

  let currentTime = 0
  function tick () {
    currentTime += 1 / 60
    var p = currentTime / finalTime
    var t = easingEquations[easing](p)

    if (p < 1) {
      window.requestAnimationFrame(tick)
      root.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t)
    } else {
      root.scrollTo(0, scrollTargetY)
      callback()
    }
  }
  tick()
}
