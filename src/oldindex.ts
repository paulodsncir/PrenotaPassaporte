import { webkit, Page } from 'playwright'
import fs from 'fs/promises'

import { passportAppointmentIsAvailable } from './functions/passport'
import { auth } from './functions/auth'

import { bot } from './services/telegram'
import { telegramUsers } from './services/telegramUsers'

import users from './constants/fakeUser'
import { Console } from 'console'


const main = async () => {
  const browser = await webkit.launch({ headless: false  })

  let timeInterval = setInterval(async () => {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, 'App running').catch()
    }
  }, 1000 * 60 * 60)

  try {
    const page = await browser.newPage()

    await auth(page, users[0].email, users[0].password)

    let loop = true
    let countError = 0
    do {
      try {
        const isAvailable = await passportAppointmentIsAvailable(page)
        console.log('trying access')

        if (typeof isAvailable === 'string') {
          console.log("erro",countError)
          countError++
        } else if (isAvailable) {
          for (const userId of telegramUsers) {
            await bot.telegram.sendMessage(userId, 'Prenotami Agendamento do passporte disponível').catch()
            console.log('Vagas Abertas')
        
          }
        }

        // loop = !isAvailable
        if (countError >=5) {
          
          throw new Error('user logout: LOGIN AGAIN')
        }
      } catch (error) {
        for (const userId of telegramUsers) {
          await bot.telegram.sendMessage(userId, (error as Error).message).catch()
        }

        if (countError >= 5) {
          throw new Error('reload main function ')
        }
      }
    } while (loop)
  } catch (error) {
    console.error('catch an error 👀: run message error: ' + (error as Error).message)
    for (const userId of telegramUsers) {
      //await bot.telegram.sendMessage(userId, (error as Error).message).catch()
    }
    await browser.close().catch()
    clearInterval(timeInterval)
    console.log("Reiniciando")
    main()
  }
}

main()
