import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function usePaperFan(target: Ref<HTMLElement | null>, reduced: Ref<boolean>) {
  let observer: IntersectionObserver | undefined;
  const settle = () => { if (target.value) target.value.dataset.fan = 'open'; };
  const onEnd = (event: AnimationEvent) => {
    const row = target.value;
    if (row && event.animationName === 'unfold-letter' && event.target === row.lastElementChild) settle();
  };
  onMounted(() => {
    const row = target.value!;
    row.dataset.fan = 'open';
    if (reduced.value) return;
    row.dataset.fan = 'folded';
    observer = new IntersectionObserver(([entry]) => {
      if (row.contains(document.activeElement)) return settle();
      if (!entry.isIntersecting) row.dataset.fan = 'folded';
      else if (entry.intersectionRatio >= .18 && row.dataset.fan === 'folded') row.dataset.fan = 'opening';
    }, { threshold: [0, .18] });
    observer.observe(row); row.addEventListener('animationend', onEnd);
  });
  onBeforeUnmount(() => { observer?.disconnect(); target.value?.removeEventListener('animationend', onEnd); if (target.value) target.value.dataset.fan = 'open'; });
  return settle;
}
