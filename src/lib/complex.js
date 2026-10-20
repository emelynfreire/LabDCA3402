// Aritmética complexa mínima. Números complexos são objetos { re, im }.
export const C = (re, im = 0) => ({ re, im })
export const cadd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im })
export const csub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im })
export const cmul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re })
export const cscale = (a, k) => ({ re: a.re * k, im: a.im * k })
export const cdiv = (a, b) => {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}
export const cabs = (a) => Math.hypot(a.re, a.im)
export const carg = (a) => Math.atan2(a.im, a.re)
export const cconj = (a) => ({ re: a.re, im: -a.im })
export const cexp = (a) => {
  const e = Math.exp(a.re)
  return { re: e * Math.cos(a.im), im: e * Math.sin(a.im) }
}
export const cpow = (a, n) => {
  let r = C(1, 0)
  for (let i = 0; i < n; i++) r = cmul(r, a)
  return r
}
