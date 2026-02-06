// flash.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FlashService } from '../../services/flash/flash.service';
import { Flash } from '../../model/flash/flash.model';

@Component({
  selector: 'app-flash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash.component.html',
})
export class FlashComponent {

  // Observable contenant la liste des messages flash (alertes)
  // Le template va s'abonner automatiquement grâce au pipe "async"
  flashes$: Observable<Flash[]>;

  constructor(private flashService: FlashService) {
    // On récupère le flux (Observable) de flashes depuis le service
    // flashes$ émettra une nouvelle liste à chaque ajout/suppression de message
    this.flashes$ = this.flashService.flashes$;
  }

  // Méthode appelée lorsqu'on clique sur le bouton de fermeture d'une alerte
  // Elle supprime le message flash correspondant dans le service
  close(id: string) {
    this.flashService.remove(id);
  }

  // Fonction utilisée par @for / trackBy pour optimiser le rendu
  // Angular identifie chaque élément grâce à son id afin d'éviter de recréer le DOM inutilement
  // Le "_" correspond à l'index (non utilisé ici)
  getFlashId(_: number, f: Flash) {
    return f.id;
  }
}


