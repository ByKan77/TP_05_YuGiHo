import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollectionService } from '../../services/collection.service';

@Component({
  selector: 'app-deck',
  imports: [RouterLink],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss',
})
export class DeckComponent {
  protected collection = inject(CollectionService);
}
