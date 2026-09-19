<script setup lang="ts">
import { computed } from 'vue';
import { wedding } from '@/data/wedding';
import ArrowIcon from './ArrowIcon.vue';
const query = encodeURIComponent(wedding.venue);
const amap = `https://uri.amap.com/search?keyword=${query}&city=${encodeURIComponent('黄山市')}&src=wedding-invitation`;
const baiduQuery = `query=${query}&region=${encodeURIComponent('歙县')}`;
const baiduWeb = `https://api.map.baidu.com/place/search?${baiduQuery}&output=html&src=webapp.wedding.invitation`;
const platform = /Android/i.test(navigator.userAgent) ? 'android' : (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : 'web');
const baidu = computed(() => platform === 'ios' ? `baidumap://map/place/search?${baiduQuery}&src=ios.wedding.invitation` : platform === 'android' ? `bdapp://map/place/search?${baiduQuery}&src=andr.wedding.invitation` : baiduWeb);
</script>

<template>
  <div class="map-directions">
    <a class="button button-line" :href="`${amap}&callnative=1`">查看地点 <span aria-hidden="true"><ArrowIcon /></span></a>
    <details class="map-options"><summary><ArrowIcon direction="right" />选择其他地图 / 网页查看</summary><nav aria-label="选择婚礼地点地图">
      <div class="map-option"><a :href="`${amap}&callnative=1`">高德地图 <span>默认</span></a><a :href="`${amap}&callnative=0`" target="_blank" rel="noreferrer" aria-label="高德地图网页版">网页版 <ArrowIcon /></a></div>
      <div class="map-option"><a :href="baidu">百度地图 <ArrowIcon /></a><a :href="baiduWeb" target="_blank" rel="noreferrer" aria-label="百度地图网页版">网页版 <ArrowIcon /></a></div>
      <div class="map-option"><a :href="`https://maps.apple.com/?q=${query}`">苹果地图 <ArrowIcon /></a></div>
    </nav><p>手机可唤起已安装的地图；若未打开，请用网页版查看。</p></details>
  </div>
</template>
