import { Component, Input, Output, EventEmitter, computed, WritableSignal, Signal, signal, ContentChild, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabContext {
  $implicit: string;
}

export interface GenericTab {
  id: string;
  title: string;
}

@Component({
  selector: 'app-tabs-container',
  imports: [CommonModule],
  templateUrl: './tabs-container.html',
  styleUrl: './tabs-container.scss',
})


export class TabsContainer implements OnChanges {
  // Input para recibir los IDs de las pestañas
  @Input({ required: true }) tabs: GenericTab[] = [];

  // Input para recibir el zipcode consultado desde el dashboard para
  @Input() requestedTab: string | null = null;

  // Output para notificar al componente padre que se cerró una pestaña
  @Output() tabClosed: EventEmitter<string> = new EventEmitter<string>();

  // Capturar la plantilla que envia el componente padre
  @ContentChild(TemplateRef) tabTemplate!: TemplateRef<TabContext>;

  // Manejo del estado para la pestaña activa
  activeTab: WritableSignal<string | null> = signal(null);


  ngOnChanges(changes: SimpleChanges): void {
    // Si la lista de pestañas cambia
    if (changes['tabs']) {
      const newTabs = changes['tabs'].currentValue as GenericTab[];
      const newTabIds = newTabs.map(tab => tab.id);

      let newActive: string | null = null;

      // Si se hizo una busqueda desde el dashboard, activar la pestaña de ese key especifico
      if (this.requestedTab && newTabIds.includes(this.requestedTab)){
        newActive = this.requestedTab;

        this.requestedTab = null;

        // Validar si la pestaña actual sigue estando en la lista de key vigentes
      } else if (this.activeTab() && newTabIds.includes(this.activeTab()!)){

        newActive = this.activeTab();

        // De no cumplirse las condicones actuales, se activa la key de la lista
      } else {

        newActive = newTabIds.length > 0 ? newTabIds[0]: null

      }

      this.activeTab.set(newActive);
    }

  }

  // Metodo para seleccionar una pestaña al hacer clic sobre ella
  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  // Método para emitir el evento de cierre de pestaña
  closeTab(event: MouseEvent, tabId: string): void {
    event.stopPropagation();

    if(this.activeTab() === tabId) {
      const index = this.tabs.findIndex(tab => tab.id === tabId);
      if(this.tabs.length > 1) {
        const newActiveIndex = index > 0 ? index - 1 : 1;
        this.activeTab.set(this.tabs[newActiveIndex].id);
      } else {
        this.activeTab.set(null);
      }
    }

    this.tabClosed.emit(tabId);
  }
}
