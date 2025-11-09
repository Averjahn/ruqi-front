const LandingRegistration = () => import('@/pages/landingRegistration/index.vue')

const meta = {
  requiresAuth: true,
  layout: 'DefaultLayout',
}
const metaIgnoreAuth = {
  requiresAuth: true,
  layout: 'DefaultLayout',
}

const i = (str) => () => import(`@/pages${str}`)

export const routes = [
  { path: '/', component: i('/main/index.vue'), meta },
  { path: '/ui-kit', component: i('/ui-kit/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-atoms', component: i('/ui-atoms/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-molecules', component: i('/ui-molecules/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-organisms', component: i('/ui-organisms/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new', component: i('/ui-new/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/atoms', component: i('/ui-new/atoms/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/molecules', component: i('/ui-new/molecules/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/profile', component: i('/ui-new/profile/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/FAQ', component: i('/ui-new/FAQ/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/document-templates', component: i('/ui-new/document-templates/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/promo', component: i('/promo/index.vue'), meta },
  { path: '/promo/invite-friend', component: i('/promo/inviteFriend.vue'), meta },
  { path: '/promo/grades', component: i('/promo/grades.vue'), meta },
  { path: '/support/:id', component: i('/support/id.vue'), meta },
  { path: '/profile', component: i('/profile/index.vue'), meta },
  {
    path: '/documents',
    component: i('/documents/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  { path: '/task/:id', component: i('/tasks/_id.vue'), meta },
  { path: '/tasks', component: i('/tasks/index.vue'), meta },
  { path: '/finance', component: i('/finance/index.vue'), meta },
  { path: '/finance/:id', component: i('/finance/_id.vue'), meta },
  { path: '/object/:id', component: i('/object/_id.vue'), meta },
  { path: '/notifications', component: i('/notifications.vue'), meta },
  {
    path: '/application',
    component: i('/application/index.vue'),
    meta: { layout: 'DefaultLayout', props: { hideMobileBottomBar: true } },
  },
  {
    path: '/privacy-policy',
    component: i('/documents/privacyPolice/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  {
    path: '/customer-contract',
    component: i('/documents/customerContract/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  {
    path: '/edo',
    component: i('/documents/edo/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  {
    path: '/personal',
    component: i('/documents/personal/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  {
    path: '/dogovor-okazaniya-uslug',
    component: i('/documents/dogovorOkazaniyaUslug/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  {
    path: '/terms-of-use',
    component: i('/documents/termsOfUse/index.vue'),
    meta: { ...meta, requiresAuth: false, props: { hideMobileBottomBar: true } },
  },
  { path: '/support', component: i('/support/index.vue'), meta: { layout: 'DefaultLayout' } },
  { path: '/welcome-prompt', redirect: '/ui-new/profile' },
  { path: '/faq-article/:id', component: i('/faqArticle/_id.vue'), meta: { layout: 'DefaultLayout' } },
  { path: '/getfriend', component: LandingRegistration, meta: { layout: 'DefaultLayout' } },
  { path: '/landing-registration', component: LandingRegistration, meta: { layout: 'DefaultLayout' } },
  { path: '/client/signin', component: i('/signin/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/client/signup', component: i('/signup/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/client/signin-recovery', component: i('/signin-recover/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/ui-new/notifications', component: i('/client/notifications/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/presignup', component: i('/PreSignUp.vue'), meta: { layout: 'RegistrationLayout' } },
  { path: '/unavailable', component: i('/unavailablePage/index.vue'), meta: { layout: 'RegistrationLayout' } },
  { path: '/already-registered', component: i('/alreadyRegistered/index.vue'), meta: { layout: 'RegistrationLayout' } },
  { path: '/email-confirm', component: i('/emailConfirm/index.vue'), meta: { layout: 'RegistrationLayout' } },
  { path: '/:pathMatch(.*)*', component: i('/404/index.vue'), meta: { layout: 'RegistrationLayout' } },
  {
    path: '/pre-registration-confirm-page',
    component: i('/preRegistrationConfirm/index.vue'),
    meta: { layout: 'RegistrationLayout' },
  },
  {
    path: '/client/organisationData',
    component: i('/organisationData/index.vue'),
    meta: { layout: 'EmptyLayout' },
  },
]
