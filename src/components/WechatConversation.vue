<script setup lang="ts">
import { ref } from 'vue';
import { chatProfiles, wedding } from '@/data/wedding';

defineProps<{ messages: { from: string; text: string }[] }>();
const avatarFailed = ref<Record<string, boolean>>({});
</script>

<template>
  <div class="wechat" role="group" aria-label="关于选照片的模拟微信聊天">
    <div class="phone-status" aria-hidden="true">
      <span>17:20</span>
      <div class="phone-indicators">
        <svg viewBox="0 0 24 18" class="signal"><rect x="1" y="12" width="4" height="5" rx="1" /><rect x="7" y="8" width="4" height="9" rx="1" /><rect x="13" y="4" width="4" height="13" rx="1" /><rect x="19" width="4" height="17" rx="1" /></svg>
        <svg viewBox="0 0 24 18" class="wifi"><path d="M1 4.8a17.2 17.2 0 0 1 22 0l-2.5 2.8a13.4 13.4 0 0 0-17 0ZM5.2 9.4a10.7 10.7 0 0 1 13.6 0l-2.6 2.8a6.7 6.7 0 0 0-8.4 0ZM9.4 14a4 4 0 0 1 5.2 0L12 17Z" /></svg>
        <span class="battery">99</span>
      </div>
    </div>
    <header class="wechat-header"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 3-9 9 9 9" /></svg><strong>{{ wedding.bride }}</strong><span aria-hidden="true">•••</span></header>
    <div class="wechat-body">
      <p class="wechat-time">婚礼前的某一天 17:28</p>
      <ol>
        <li v-for="(message, index) in messages" :key="index" :class="{ outgoing: message.from === 'groom' }">
          <div class="wechat-avatar" aria-hidden="true">
            <img v-if="!avatarFailed[message.from]" :src="message.from === 'groom' ? chatProfiles.groom.avatar : chatProfiles.bride.avatar" alt="" loading="lazy" draggable="false" @error="avatarFailed[message.from] = true" />
            <span v-else>{{ message.from === 'groom' ? wedding.groom.slice(-1) : wedding.bride.slice(-1) }}</span>
          </div>
          <div class="wechat-bubble"><span class="sr-only">{{ message.from === 'groom' ? wedding.groom : wedding.bride }}：</span>{{ message.text }}</div>
        </li>
      </ol>
    </div>
    <div class="wechat-composer" aria-hidden="true">
      <svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" /><path d="M12 11q5 4 0 8m4-12q8 8 0 16" /></svg>
      <div class="wechat-input" />
      <svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" /><path d="M9 17q6 10 12 0" /><circle class="eye" cx="11" cy="11" r="1" /><circle class="eye" cx="19" cy="11" r="1" /></svg>
      <svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" /><path d="M8 15h14M15 8v14" /></svg>
    </div>
    <div class="phone-bottom" aria-hidden="true"><i /></div>
  </div>
  <p class="wechat-note">{{ wedding.groom }} &amp; {{ wedding.bride }} · 幸福筹备中的模拟对话</p>
</template>

<style scoped>
.wechat { max-width: 560px; margin: 36px auto 0; overflow: hidden; border: 1px solid #e2dfe0; border-radius: 20px; color: #141414; background: #ededed; box-shadow: 0 16px 36px #71313e0d; font-family: var(--sans); }
.phone-status { display: flex; justify-content: space-between; align-items: center; padding: 19px 26px 15px; background: linear-gradient(#e1eedf, #ededed); font-size: 18px; font-weight: 650; line-height: 1; font-variant-numeric: tabular-nums; }
.phone-indicators { display: flex; align-items: center; gap: 7px; }.signal { width: 21px; height: 16px; fill: #111; }.wifi { width: 22px; height: 17px; fill: #111; }
.battery { position: relative; display: grid; place-items: center; width: 29px; height: 17px; margin-right: 3px; border-radius: 5px; background: #111; color: #fff; font-size: 12px; font-weight: 700; }.battery::after { content: ''; position: absolute; right: -3px; width: 2px; height: 7px; background: #777; border-radius: 0 2px 2px 0; }
.wechat-header { height: 58px; display: grid; grid-template-columns: 28px 1fr 28px; align-items: center; padding: 0 18px; border-bottom: 1px solid #dcdcdc; }.wechat-header > svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8; }.wechat-header strong { text-align: center; font-size: 18px; font-weight: 600; }.wechat-header > span { font-size: 17px; letter-spacing: 2px; }
.wechat-body { padding: 24px 16px 30px; }.wechat-time { margin: 0 0 25px; text-align: center; color: #a0a0a0; font-size: 11px; }.wechat ol { display: flex; flex-direction: column; gap: 23px; margin: 0; padding: 0; list-style: none; }.wechat li { display: flex; align-items: flex-start; gap: 11px; }.wechat li.outgoing { flex-direction: row-reverse; }
.wechat-avatar { flex: none; display: grid; place-items: center; width: 40px; height: 40px; overflow: hidden; border-radius: 5px; background: #f6d7e2; color: #9c3d5b; font: 20px var(--hand); }.wechat-avatar img { width: 100%; height: 100%; object-fit: cover; }
.wechat-bubble { position: relative; max-width: calc(100% - 100px); padding: 10px 12px; border-radius: 5px; background: #fff; color: #171717; font-size: 15px; line-height: 1.65; overflow-wrap: anywhere; }.wechat-bubble::before { content: ''; position: absolute; top: 15px; left: -4px; width: 8px; height: 8px; background: inherit; transform: rotate(45deg); }.outgoing .wechat-bubble { background: #95ec69; }.outgoing .wechat-bubble::before { right: -4px; left: auto; }
.wechat-composer { display: flex; align-items: center; gap: 12px; padding: 10px 13px; border-top: 1px solid #ddd; background: #f7f7f7; }.wechat-composer > svg { flex: none; width: 28px; height: 28px; fill: none; stroke: #262626; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }.wechat-composer .eye { fill: #262626; stroke: none; }.wechat-input { flex: 1; min-width: 0; height: 38px; border-radius: 6px; background: #fff; }
.phone-bottom { display: grid; place-items: end center; height: 21px; padding-bottom: 6px; background: #f7f7f7; }.phone-bottom i { display: block; width: 105px; height: 4px; border-radius: 9px; background: #252525; }.wechat-note { margin: 13px auto 0; text-align: center; color: #a48b94; font-size: 10px; line-height: 1.6; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 400px) { .phone-status { padding-inline: 20px; font-size: 16px; }.wechat-body { padding-inline: 11px; }.wechat-avatar { width: 35px; height: 35px; }.wechat li { gap: 9px; }.wechat-bubble { max-width: calc(100% - 80px); font-size: 14px; }.wechat-composer { gap: 9px; padding-inline: 10px; }.wechat-composer > svg { width: 25px; height: 25px; } }
</style>
