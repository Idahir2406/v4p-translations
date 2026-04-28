import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { envs } from 'src/config/envs';

@Injectable()
export class CronJobsService {
  private readonly baseUrl = envs.BASE_URL.replace(/\/+$/, '');
  private readonly cronToken = envs.CRON_TOKEN;

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleCron() {
    await Promise.allSettled([
      this.sendAnfitriones(),
      this.sendCertificaciones(),
      this.sendMarketing(),
    ]);
  }

  private buildFormData(payload: Record<string, string>): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('cron_token', this.cronToken);

    return formData;
  }

  private async postForm(path: string, payload: Record<string, string>) {
    const url = `${this.baseUrl}/php/${path}`;
    const body = this.buildFormData(payload);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
      });

      if (!response.ok) {
        console.error(`[CronJobsService] ${path} failed with status ${response.status}`);
        return;
      }

      console.log(`[CronJobsService] ${path} executed successfully`);
    } catch (error) {
      console.error(`[CronJobsService] ${path} request error`, error);
    }
  }

  private async sendAnfitriones() {
    await this.postForm('pageAnfitriones_sendMail.php', {
      fho_site: 'irving',
      fho_name: 'idahir',
      fho_province: 'gioasdg',
      fho_phone: '0983708845',
      fho_email: 'idairreyes@gmail.com',
      fho_comments: 'asdgasoidhgio asidg asd',
      fho_captcha: 'WL2A72',
    });
  }

  private async sendCertificaciones() {
    await this.postForm('pageCertificaciones_sendMail.php', {
      fce_type: 'hotel',
      fce_site: 'irving',
      fce_name: 'idahir',
      fce_city: 'Manabi',
      fce_id_provincia: '91',
      fce_phone: '0983708845',
      fce_email: 'idairreyes@gmail.com',
      fce_web: 'idairreyes.com',
      fce_online: 'yes',
      fce_comments: 'este es el mensaje',
      fce_captcha: '9NCM78',
    });
  }

  private async sendMarketing() {
    await this.postForm('pageMarketing_sendMail.php', {
      fmk_email: 'idairreyes@gmail.com',
    });
  }
}
