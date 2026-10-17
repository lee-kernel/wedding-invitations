<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ArrowIcon from './ArrowIcon.vue';
import ModalDialog from './ModalDialog.vue';
import KittyAccent from './KittyAccent.vue';
import { wedding } from '@/data/wedding';
import { createInvitationImage, invitationImageName, invitationImageSize } from '@/lib/invitation-image';
type Device = 'ios' | 'android' | 'wechat' | 'desktop';
const ready = ref(false), open = ref(false), file = ref<File | null>(null), url = ref(''), canShare = ref(false), sharing = ref(false), feedback = ref('');
const device = ref<Device>('desktop');
const generating = ref(false);
const generationFailed = ref(false);
const originalImageUrl = `${import.meta.env.BASE_URL}images/invitation/invitation-card.png`;
const trigger = ref<HTMLButtonElement | null>(null);
function currentDevice(): Device { if (/MicroMessenger/i.test(navigator.userAgent)) return 'wechat'; if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios'; if (/Android/i.test(navigator.userAgent)) return 'android'; return 'desktop'; }
const hint = computed(() => device.value === 'ios' ? '长按图片保存，或在系统菜单中选择“存储图像”。' : device.value === 'android' || device.value === 'wechat' ? '长按图片，选择“保存图片”；也可以直接下载。' : '下载这张邀请，把相聚的时间和地点留在手边。');
async function prepareImage() {
  if (generating.value || file.value) return;
  generating.value = true;
  generationFailed.value = false;
  feedback.value = '';
  try {
    let image: File;
    try {
      const response = await fetch(originalImageUrl);
      if (!response.ok || !response.headers.get('content-type')?.includes('image/png')) throw new Error('Original PNG unavailable');
      image = new File([await response.blob()], invitationImageName, { type: 'image/png' });
      // A real HTTP image URL lets WeChat fetch the original instead of a blob preview.
      url.value = originalImageUrl;
    } catch {
      image = await createInvitationImage();
      url.value = URL.createObjectURL(image);
    }
    file.value = image;
    canShare.value = device.value !== 'desktop' && device.value !== 'wechat' && !!navigator.share && !!navigator.canShare?.({ files: [image] });
  } catch {
    generationFailed.value = true;
    feedback.value = '图片暂未生成成功，请点击重试。';
  } finally { generating.value = false; }
}
watch(open, (isOpen) => { if (isOpen) void prepareImage(); });
async function shareImage() { if (!file.value || sharing.value) return; sharing.value = true; feedback.value = ''; try { await navigator.share({ files: [file.value] }); } catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) feedback.value = '也可以长按图片保存，或使用下方“下载图片”。'; } finally { sharing.value = false; } }
function show() { device.value = currentDevice(); feedback.value = ''; open.value = true; }
onMounted(() => { ready.value = true; });
onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value); });
</script>

<template>
  <button ref="trigger" class="button button-red" :disabled="!ready" @click="show">保存为图片 <span aria-hidden="true"><ArrowIcon /></span></button>
  <ModalDialog :open="open" class-name="image-save-dialog" label="把邀请，留在手边。" :final-focus="trigger" @close="open = false">
    <header class="image-save-header"><div><span>A LITTLE KEEPSAKE</span><h2>把这份欢喜，存进相册。</h2></div><button type="button" aria-label="收起邀请图片" @click="open = false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>
    <div class="image-save-summary"><span>{{ wedding.groom }} <i>&amp;</i> {{ wedding.bride }}</span><span>{{ wedding.date }}</span></div>
    <section class="image-save-scroll" tabindex="0" aria-label="邀请图片预览，可滚动或长按保存">
      <KittyAccent class="image-save-bow" variant="bow" />
      <img v-if="url" class="invitation-image" :src="url" alt="张子乔与陈美嘉诚挚敬邀，2027年1月31日，17:28到场、17:58仪式，黄山市歙县徽苑一楼，2号厅" :width="invitationImageSize.width" :height="invitationImageSize.height" />
      <div v-else class="image-save-loading" role="status"><span aria-hidden="true">囍</span><p>{{ generationFailed ? '这份邀请还差最后一笔' : '正在写好这份邀请…' }}</p><small>{{ generationFailed ? '请重试一次，稍后就好' : '把时间、地点和我们的期待，一起装好' }}</small><button v-if="generationFailed" type="button" class="button button-line" @click="prepareImage">重新生成</button></div>
    </section>
    <div class="image-save-actions" :data-device="device"><p class="image-save-hint">{{ hint }}</p><div class="image-save-buttons">
      <button v-if="canShare" class="button button-red" :disabled="sharing || !url" @click="shareImage">{{ sharing ? '正在打开…' : '打开系统保存菜单' }}<span aria-hidden="true"><ArrowIcon /></span></button>
      <a v-if="url" :class="`button ${canShare ? 'button-line' : 'button-red'}`" :href="url" :download="invitationImageName" @click="feedback = device === 'ios' ? '若出现图片预览，可长按保存到相册。' : '可在浏览器的下载记录中查看图片。'">下载图片 <span aria-hidden="true"><ArrowIcon direction="down" /></span></a>
      </div><p v-if="url" class="image-save-format">高清 PNG · 1080 × 2160 · 留住相聚的约定</p>
      <output class="image-save-feedback" aria-live="polite">{{ feedback }}</output>
    </div>
  </ModalDialog>
</template>
