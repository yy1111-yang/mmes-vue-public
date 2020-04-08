import defaultSettings from '@/settings'

const title = defaultSettings.title || 'MMes Admin'

// return title in browser
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
