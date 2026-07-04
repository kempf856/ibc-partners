import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PartnerDto} from '../../features/dashboard/partner/partner-dto';

@Injectable({
  providedIn: 'root',
})
export class ActivePartnerService {
  http = inject(HttpClient);

  private activePartnerKey = 'activePartner';

  readonly activePartnerId = signal<number | null>(null);
  readonly partners = signal<PartnerDto[]>([]);

  loadActivePartners() {
    return this.getActivePartners().subscribe(partners => {
      this.partners.set(partners);

      const storageId = localStorage.getItem(this.activePartnerKey);
      if (partners.some(partner => partner.id?.toString() === storageId)) {
        this.activePartnerId.set(Number(storageId));
      } else if (partners.length > 0 && partners[0].id) {
        this.activePartnerId.set(partners[0].id)
        localStorage.setItem(this.activePartnerKey, partners[0].id.toString());
      } else {
        this.activePartnerId.set(null);
        localStorage.removeItem(this.activePartnerKey);
      }
    });
  }

  setActivePartner(id: number) {
    this.activePartnerId.set(id);
    localStorage.setItem(this.activePartnerKey, id.toString());
  }

  getActivePartners() {
    return this.http.get<PartnerDto[]>('/api/partners/active');
  }

  getActivePartnerName() {
    return this.partners().find(partner => partner.id === this.activePartnerId())?.name || '';
  }
}
