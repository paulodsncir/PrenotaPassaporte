import { Page } from 'playwright'
import screenshotDesktop from 'screenshot-desktop'

import { RESERVA_NAV, HOME_NAV } from '../constants/locators'
import { formatDate } from './formatDate'
import { url } from 'inspector'

export const passportAppointmentIsAvailable = async (
  page: Page,
  screenshot: { filename?: string; manualScreenshot?: false } = {},
) => {
  const path = __dirname.split('\\')
  path.splice(path.length - 2, 2)

  try {
    console.log("começando")
    // await page.reload();
    // await page.waitForNavigation();
    await page.waitForTimeout(5);
    await page.locator(RESERVA_NAV).click()
    console.log("clickedNav")
    await page.goto("https://prenotami.esteri.it/Services")
    console.log("gotoService")
    await page.waitForLoadState('load')
    console.log("loadService")
    await page.waitForTimeout(5);
    await page.locator('a[href="/Services/Booking/1319"] > button.button.primary').click({ force: true });
    // await page.locator('a[href="/Services/Booking/503"] > button.button.primary').click({force:true});
    await page.waitForTimeout(5);
    await page.waitForLoadState('load')
    console.log("load2")
    const url = await page.url()
    if (url.includes("/Services/Booking/1319") && await page.$("#typeofbookingddl")) {
      console.log("entrei no if")

      return true

    } else {
      console.log("entrei no else")

      await page.locator('.jconfirm-buttons > button').click()

      return false
    }


    //    const text = await page
    //     .locator('.jconfirm-content > div')
    //    .innerText()
    //   .catch(error => '')

    /*   if (
         text ===
         "Stante l'elevata richiesta i posti disponibili per il servizio scelto sono esauriti. Si invita a controllare con frequenza la disponibilità in quanto l’agenda viene aggiornata regolarmente"
       ) {
         if (screenshot.filename && !screenshot.manualScreenshot) {
           await screenshotDesktop({
             filename: `${path.join('/')}/screenshots/${screenshot.filename}_${formatDate(
               new Date(),
               '_',
             )}.png`,
           })
         } else {
           if (screenshot.manualScreenshot) {
             await page.waitForTimeout(1000 * 12)
           }
         }
   
         await page.locator('.jconfirm-buttons > button').click()
       }
   
       return !(
         text ===
         "Stante l'elevata richiesta i posti disponibili per il servizio scelto sono esauriti. Si invita a controllare con frequenza la disponibilità in quanto l’agenda viene aggiornata regolarmente"
       )
       */

  } catch (error) {
    console.error('catch an error 👀: passportAppointmentIsAvailable')
    return 'error'
  }
}
