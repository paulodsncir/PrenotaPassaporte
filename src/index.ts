import { webkit } from 'playwright';
import { passportAppointmentIsAvailable } from './functions/passport';
import { auth } from './functions/auth';
import { bot } from './services/telegram';
import { telegramUsers } from './services/telegramUsers';
import users from './constants/fakeUser';

const startInterval = () => {
  return setInterval(async () => {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, 'App running').catch();
    }
  },  1000 * 60 * 60 * 12);
};

const prenota = async () => {
  let browser = await webkit.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await auth(page, users[0].email, users[0].password);

    let loop = true;
    let countError = 0;
    do {
      try {
        const isAvailable = await passportAppointmentIsAvailable(page);
        console.log('trying access');

        if (typeof isAvailable === 'string') {
          console.log('erro', countError);
          countError++;
        } else if (isAvailable) {
          for (const userId of telegramUsers) {
            await bot.telegram.sendMessage(userId, 'Prenotami Agendamento do passaporte disponível').catch();
            console.log('Vagas Abertas');
          }
        }

        if (countError >= 5) {
          throw new Error('user logout: LOGIN AGAIN');
        }
      } catch (error) {
        for (const userId of telegramUsers) {
          // await bot.telegram.sendMessage(userId, error.message).catch();
        }

        if (countError >= 5) {
          throw new Error('reload main function ');
        }
      }
    } while (loop);
  } catch (error) {
    console.error('catch an error 👀: run message error: ' + error.message);
    for (const userId of telegramUsers) {
      // await bot.telegram.sendMessage(userId, error.message).catch();
    }
    await browser.close().catch();

    console.log('Reiniciando');
    prenota();
  }
};

const main = async () => {

  for (const userId of telegramUsers) {
    await bot.telegram.sendMessage(userId, 'App started').catch();
  }

  let timeInterval = startInterval();
  prenota();
};

main();