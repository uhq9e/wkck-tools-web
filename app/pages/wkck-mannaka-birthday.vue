<script lang="ts" setup>
import {
  calcNextHalfwayBirthday,
  getRemainingTime,
  type Birthday,
} from "~/misc/utils";
import { siteHost } from "~/misc";

useSeoMeta({
  title: $t("pages./wkck-mannaka-birthday.title"),
  description: $t("pages./wkck-mannaka-birthday.description"),
  ogTitle: $t("pages./wkck-mannaka-birthday.title"),
  ogDescription: $t("pages./wkck-mannaka-birthday.description"),
  ogImage: `${siteHost}/tools/wkck-mannaka-birthday.webp`,
  twitterCard: "summary",
});

const route = useRoute();

const shareUrl = `${siteHost}${route.fullPath}`;

const WakabaBirthday: Birthday = [6, 20];
const ChikageBirthday: Birthday = [2, 3];

const nextHalfwayBirthday = computed(() => {
  count.value;
  return calcNextHalfwayBirthday(WakabaBirthday, ChikageBirthday);
});

const countdownToBirthday = computed(() => {
  count.value;
  return getRemainingTime(nextHalfwayBirthday.value);
});

const twitterShareUrl = computed(() => {
  const text = $t("pages./wkck-mannaka-birthday.shareTextTemplate", {
    birthday: nextHalfwayBirthday.value.toLocaleDateString(),
    countdown: $t("pages./wkck-mannaka-birthday.countdownTemplate", {
      days: countdownToBirthday.value.days,
      daysWord: $t(
        "pages./wkck-mannaka-birthday.days",
        countdownToBirthday.value.days
      ),
      hours: countdownToBirthday.value.hours,
      hoursWord: $t(
        "pages./wkck-mannaka-birthday.hours",
        countdownToBirthday.value.hours
      ),
      minutes: countdownToBirthday.value.minutes,
      minutesWord: $t(
        "pages./wkck-mannaka-birthday.minutes",
        countdownToBirthday.value.minutes
      ),
      seconds: countdownToBirthday.value.seconds,
      secondsWord: $t(
        "pages./wkck-mannaka-birthday.seconds",
        countdownToBirthday.value.seconds
      ),
    }),
  });

  const hashTags = ["WKCKTools", $t("pages./wkck-mannaka-birthday.title")];

  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashTags.map((t) => t.replace(/ /g, "")).join(","))}`;
});

const start = new Date();
const count = ref(0);

function tick() {
  count.value++;
  const next = 1000 * count.value - (Date.now() - start.getTime());
  setTimeout(tick, Math.max(0, next));
}

setTimeout(tick, 1000);
</script>

<template>
  <ToolPageLayout>
    <I18nT
      class="text-sm flex flex-col items-center gap-3"
      keypath="pages./wkck-mannaka-birthday.caption"
      scope="global"
      tag="div"
    >
      <template #countdown>
        <ClientOnly>
          <div class="flex flex-wrap gap-8 justify-center">
            <div
              v-for="key in ['days', 'hours', 'minutes', 'seconds'] as const"
              :key
              class="flex flex-col items-center"
            >
              <div class="text-7xl font-bold">
                {{ countdownToBirthday[key].toString().padStart(2, "0") }}
              </div>
              <div class="text-sm tracking-widest uppercase">
                {{
                  $t(
                    `pages./wkck-mannaka-birthday.${key}`,
                    countdownToBirthday[key]
                  )
                }}
              </div>
            </div>
          </div>
        </ClientOnly>
      </template>
      <template #birthday>
        <div class="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <div class="date-box bg-[#a70013]">
            {{
              new Date(
                nextHalfwayBirthday.getFullYear(),
                ChikageBirthday[0] - 1,
                ChikageBirthday[1]
              ).toLocaleDateString()
            }}
          </div>
          <span class="sm:hidden">↓</span>
          <span class="hidden sm:block">→</span>
          <div class="date-box bg-[#8e3f5c]">
            {{ nextHalfwayBirthday.toLocaleDateString() }}
          </div>
          <span class="sm:hidden">↑</span>
          <span class="hidden sm:block">←</span>
          <div class="date-box bg-[#495ea7]">
            {{
              new Date(
                nextHalfwayBirthday.getFullYear(),
                WakabaBirthday[0] - 1,
                WakabaBirthday[1]
              ).toLocaleDateString()
            }}
          </div>
        </div>
      </template>
    </I18nT>
    <ClientOnly>
      <NuxtLink :to="twitterShareUrl" target="_blank">
        <Button size="sm">
          <Icon name="uil:twitter" />
          {{ $t("shared.share") }}
        </Button>
      </NuxtLink>
    </ClientOnly>
  </ToolPageLayout>
</template>

<style scoped>
@reference "../assets/css/tailwind.css";

.date-box {
  @apply text-xs font-bold tracking-wider text-primary-foreground rounded shadow px-1 py-0.5;
}
</style>
