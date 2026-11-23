import type { Locale } from '@/lib/i18n/config';
import type { FeedbackError } from './submit';

const en = {
  title: 'Send feedback',
  description: 'Tell us about bugs, ideas or anything else about printmd. Messages go straight to the developer.',
  back: '← Back to printmd',
  heading: 'Send feedback',
  intro: 'Bugs, ideas, anything — a few lines are enough. Messages go straight to the developer.',
  nameLabel: 'Your name',
  nameOptional: '(optional)',
  namePlaceholder: 'Leave empty to stay anonymous',
  messageLabel: 'Message',
  messagePlaceholder: 'What happened, or what would you like to see?',
  submit: 'Send',
  sending: 'Sending…',
  success: 'Thanks! Your message was sent.',
  sendAnother: 'Send another message',
  privacyNote: 'Along with your message we send the page you came from, your browser name and language. Nothing else is collected.',
  mailFallback: 'Prefer email?',
  mailLink: 'Write to us instead',
  errors: {
    invalid: 'Something went wrong with the form. Please reload the page and try again.',
    empty: 'Please write a message.',
    tooLong: 'The message is too long.',
    tooFast: 'That was quick! Please wait a moment and send again.',
    rateLimited: 'Too many messages in a short time. Please try again in a few minutes.',
    server: 'The message could not be sent. Please try again later or email us.',
  } satisfies Record<FeedbackError, string>,
};

const ko: typeof en = {
  title: '의견 보내기',
  description: 'printmd를 쓰며 겪은 버그, 아이디어, 무엇이든 보내 주세요. 개발자에게 바로 전달됩니다.',
  back: '← printmd로 돌아가기',
  heading: '의견 보내기',
  intro: '버그, 아이디어, 무엇이든 몇 줄이면 충분합니다. 보낸 내용은 개발자에게 바로 전달됩니다.',
  nameLabel: '이름',
  nameOptional: '(선택)',
  namePlaceholder: '비워 두면 익명으로 보내집니다',
  messageLabel: '내용',
  messagePlaceholder: '어떤 일이 있었는지, 무엇이 있으면 좋을지 적어 주세요',
  submit: '보내기',
  sending: '보내는 중…',
  success: '고맙습니다! 의견이 전달되었습니다.',
  sendAnother: '다른 의견 보내기',
  privacyNote: '내용과 함께 들어온 페이지, 브라우저 종류와 언어가 전달됩니다. 그 밖의 정보는 모으지 않습니다.',
  mailFallback: '메일이 편하신가요?',
  mailLink: '메일로 보내기',
  errors: {
    invalid: '양식에 문제가 생겼습니다. 페이지를 새로고침한 뒤 다시 보내 주세요.',
    empty: '내용을 적어 주세요.',
    tooLong: '내용이 너무 깁니다.',
    tooFast: '너무 빨리 보내셨어요. 잠시 뒤 다시 보내 주세요.',
    rateLimited: '짧은 시간에 너무 많이 보내셨습니다. 몇 분 뒤 다시 시도해 주세요.',
    server: '전송에 실패했습니다. 잠시 뒤 다시 시도하거나 메일로 보내 주세요.',
  },
};

export type FeedbackStrings = typeof en;

export const FEEDBACK_STRINGS: Record<Locale, FeedbackStrings> = { en, ko };
