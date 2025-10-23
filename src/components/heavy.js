// Heavy components that should be loaded on demand
export const heavyComponents = {
  // Large UI components
  AvatarCropper: () => import('@/components/atoms/AvatarCropper.vue'),
  LogoUpload: () => import('@/components/atoms/LogoUpload.vue'),
  
  // Large molecules
  RegistrationSteps: () => import('@/components/molecules/RegistrationSteps.vue'),
  
  // Large organisms
  TopBarMobile: () => import('@/components/organisms/TopBarMobile.vue'),
  userMenu: () => import('@/components/organisms/userMenu.vue'),
}

// Helper function to register heavy components
export const registerHeavyComponent = (app, componentName) => {
  if (heavyComponents[componentName]) {
    heavyComponents[componentName]().then(module => {
      app.component(componentName, module.default)
    })
  }
}
