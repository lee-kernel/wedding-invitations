<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ArrowIcon from './ArrowIcon.vue';
import ModalDialog from './ModalDialog.vue';
import { createInvitationImage, invitationImageName } from '@/lib/invitation-image';
type Device = 'ios' | 'android' | 'wechat' | 'desktop';
const ready = ref(false), open = ref(false), file = ref<File | null>(null), url = ref(''), canShare = ref(false), sharing = ref(false), feedback = ref('');
const device = ref<Device>('desktop');
const trigger = ref<HTMLButtonElement | null>(null);
function currentDevice(): Device { if (/MicroMessenger/i.test(navigator.userAgent)) return 'wechat'; if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios'; if (/Android/i.test(navigator.userAgent)) return 'android'; return 'desktop'; }
const hint = computed(() => device.value === 'ios' ? '长按图片保存，或在系统菜单中选择“存储图像”。' : device.value === 'android' || device.value === 'wechat' ? '长按图片，选择“保存图片”；也可以直接下载。' : '下载这张邀请，把相聚的时间和地点留在手边。');
watch(open, async (isOpen) => {
  if (!isOpen || file.value) return;
  try {
    const image = await createInvitationImage();
    if (!open.value) return;
    url.value = URL.createObjectURL(image); file.value = image;
    canShare.value = device.value !== 'desktop' && device.value !== 'wechat' && !!navigator.share && !!navigator.canShare?.({ files: [image] });
  } catch { feedback.value = '图片暂未准备好，请收起后再试一次。'; }
});
async function shareImage() { if (!file.value || sharing.value) return; sharing.value = true; feedback.value = ''; try { await navigator.share({ files: [file.value] }); } catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) feedback.value = '也可以长按图片保存，或使用下方“下载图片”。'; } finally { sharing.value = false; } }
function show() { device.value = currentDevice(); feedback.value = ''; open.value = true; }
onMounted(() => { ready.value = true; });
onBeforeUnmount(() => { if (url.value) URL.revokeObjectURL(url.value); });
</script>

<template>
  <button ref="trigger" class="button button-red" :disabled="!ready" @click="show">保存为图片 <span aria-hidden="true"><ArrowIcon /></span></button>
  <ModalDialog :open="open" class-name="image-save-dialog" label="把邀请，留在手边。" :final-focus="trigger" @close="open = false">
    <header class="image-save-header"><div><span>囍 · SAVE THE DATE</span><h2>把邀请，留在手边。</h2></div><button aria-label="收起邀请图片" @click="open = false">×</button></header>
    <section class="image-save-scroll" tabindex="0" aria-label="邀请图片预览，可滚动或长按保存">
      <img v-if="url" class="invitation-image" :src="url" alt="张子乔与陈美嘉诚挚敬邀，2026年10月3日，17:28到场、17:58仪式，黄山市歙县徽苑一楼，2号厅" width="1080" height="1620" />
      <output v-else>正在写好这份邀请…</output>
    </section>
    <div class="image-save-actions" :data-device="device"><p>{{ hint }}</p>
      <button v-if="canShare" class="button button-red" :disabled="sharing || !url" @click="shareImage">{{ sharing ? '正在打开…' : '打开系统保存菜单' }}<span aria-hidden="true"><ArrowIcon /></span></button>
      <a v-if="url" :class="`button ${canShare ? 'button-line' : 'button-red'}`" :href="url" :download="invitationImageName" @click="feedback = device === 'ios' ? '若出现图片预览，可长按保存到相册。' : '可在浏览器的下载记录中查看图片。'">下载图片 <span aria-hidden="true"><ArrowIcon direction="down" /></span></a>
      <output class="image-save-feedback">{{ feedback }}</output>
    </div>
  </ModalDialog>
</template>
