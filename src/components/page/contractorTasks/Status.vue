<!-- eslint-disable max-len -->
<template>
  <div class="rq-status" :class="classStatusObj(status)">
    <div class="rq-status__wrapper">
      <div v-if="!status" class="rq-status__inner">
        <div class="rq-status__title">{{ 'открыт набор' }}</div>
      </div>
      <div v-else class="rq-status__inner">
        <div v-if="status === 'invited'" class="rq-status__icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.75 12.75V12C6.33579 12 6 12.3358 6 12.75H6.75ZM11.25 12.75H12C12 12.3358 11.6642 12 11.25 12V12.75ZM6.75 13.5H11.25V12H6.75V13.5ZM10.5 12.75V13.5H12V12.75H10.5ZM7.5 13.5V12.75H6V13.5H7.5ZM9 15C8.17157 15 7.5 14.3284 7.5 13.5H6C6 15.1569 7.34315 16.5 9 16.5V15ZM10.5 13.5C10.5 14.3284 9.82843 15 9 15V16.5C10.6569 16.5 12 15.1569 12 13.5H10.5Z"
              fill="white"
            />
            <path
              d="M3.21967 11.0303L2.68934 10.5H2.68934L3.21967 11.0303ZM3.60279 10.6472L4.13312 11.1776H4.13312L3.60279 10.6472ZM14.3972 10.6472L14.9275 10.1169L14.9275 10.1169L14.3972 10.6472ZM14.7803 11.0303L15.3107 10.5L15.3107 10.5L14.7803 11.0303ZM8.99999 2.25L8.99999 3L8.99999 2.25ZM14.25 12H3.75V13.5H14.25V12ZM3.75 12V11.5607H2.25V12H3.75ZM3.75 11.5607L4.13312 11.1776L3.07246 10.1169L2.68934 10.5L3.75 11.5607ZM4.5 10.2918V7.5H3V10.2918H4.5ZM13.5 7.5V10.2918H15V7.5H13.5ZM13.8669 11.1775L14.25 11.5607L15.3107 10.5L14.9275 10.1169L13.8669 11.1775ZM14.25 11.5607V12H15.75V11.5607H14.25ZM14.25 11.5607L14.25 11.5607H15.75C15.75 11.1628 15.592 10.7813 15.3107 10.5L14.25 11.5607ZM13.5 10.2918C13.5 10.624 13.632 10.9426 13.8669 11.1775L14.9275 10.1169C14.9739 10.1633 15 10.2262 15 10.2918H13.5ZM15 7.5C15 4.18629 12.3137 1.49999 8.99998 1.5L8.99999 3C11.4853 2.99999 13.5 5.01471 13.5 7.5H15ZM4.5 7.5C4.5 5.01472 6.51471 3.00001 8.99999 3L8.99998 1.5C5.68628 1.50001 3 4.1863 3 7.5H4.5ZM4.13312 11.1776C4.36803 10.9426 4.5 10.624 4.5 10.2918H3C3 10.2262 3.02606 10.1633 3.07246 10.1169L4.13312 11.1776ZM3.75 11.5607H3.75L2.68934 10.5C2.40804 10.7813 2.25 11.1628 2.25 11.5607H3.75ZM3.75 12H2.25C2.25 12.8284 2.92157 13.5 3.75 13.5V12ZM14.25 13.5C15.0784 13.5 15.75 12.8284 15.75 12H14.25V13.5Z"
              fill="white"
            />
            <path
              d="M13.5137 1.51025C14.5481 2.28974 15.363 3.32382 15.8791 4.5118"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.48647 1.51025C3.45206 2.28974 2.63715 3.32382 2.12109 4.5118"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div v-else-if="status === 'shift_data_on_processing'" class="rq-status__icon">
          <img class="rq-status__icon" src="@/assets/icon_deprecated/hourglass_blue.svg" />
        </div>
        <div class="rq-status__title">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusComponent',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    text () {
      switch (this.status) {
        case 'requested':
        case 'acceptInvited':
          return 'хочу работать'

        case 'task_completed':
          return 'работа завершена'

        case 'is_recruting':
        case 'is_recruting_urgently':
          return 'открыт набор'

        case 'working':
          return 'работаем'

        case 'waiting_confirm':
          return 'ждём подтверждения'

        case 'recruting_closed':
        case 'refused':
        case 'rejected':
          return 'набор закрыт'

        case 'invite':
          return 'приглашаем на работу'

        case 'userRefused':
          return 'не поеду'

        case 'shift_data_on_processing':
          return 'на обработке'

        case 'need_to_sign_documents':
          return 'требуется подписать документы'

        case 'shift_has_begun':
          return 'смена началась'

        default:
          return 'статус неизвестен'
      }
    },
  },
  methods: {
    classStatusObj: (status) => {
      return {
        status_yellow:
          status === 'requested' ||
          status === 'acceptInvited' ||
          status === 'waiting_confirm' ||
          status === 'shift_has_begun' ||
          status === 'need_to_sign_documents',
        status_brown: status === 'userRefused',
        status_violet: status === 'working',
        status_black: status === 'task_completed',
        status_blue:
          !status ||
          status === 'is_recruting' ||
          status === 'is_recruting_urgently' ||
          status === 'shift_data_on_processing',
        status_red: status === 'rejected' || status === 'recruting_closed' || status === 'refused',
        invited: status === 'invite',
      }
    },
  },
}
</script>

<style lang="scss">
.rq-status {
  height: 24px;
  border-radius: 4px;

  .rq-status__wrapper {
    .rq-status__inner {
      display: flex;
      padding: 4px 8px;
      gap: 4px;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;

      .rq-status__icon {
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .rq-status__title {
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: 12px;
        text-transform: uppercase;
      }
    }
  }

  &.status_blue {
    background: #f2f8ff;
    border: 1px solid #0082de;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #0082de !important;
        }
      }
    }
  }

  &.status_yellow {
    background: #fffcf0;
    border: 1px solid #f4d150;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #f4d150;
        }
      }
    }
  }

  &.status_red {
    background: #fff6f5;
    border: 1px solid #eb4d3d;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #eb4d3d;
        }
      }
    }
  }

  &.status_green {
    background: #ecffec;
    border: 1px solid #71d472;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #71d472;
        }
      }
    }
  }

  &.status_violet {
    background: #f2efff;
    border: 1px solid #7b61ff;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #7b61ff;
        }
      }
    }
  }

  &.status_brown {
    background: #fff5ea;
    border: 1px solid #cea574;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #cea574;
        }
      }
    }
  }

  &.status_black {
    background: #fafafa;
    border: 1px solid #666666;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #666666;
        }
      }
    }
  }

  &.invited {
    background: #0082de;
    border: 1px solid #0082de;

    .rq-status__wrapper {
      .rq-status__inner {
        .rq-status__title {
          color: #fff;
        }
      }
    }
  }
}
</style>
