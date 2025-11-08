export function computeWindow(total: number, containerHeight: number, rowHeight: number, scrollTop: number) {
  const itemsPerScreen = Math.ceil(containerHeight / rowHeight)
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - itemsPerScreen)
  const end = Math.min(total, start + itemsPerScreen * 3)
  return { start, end }
}
