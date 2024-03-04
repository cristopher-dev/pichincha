import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  @Input() header: any[] = [];
  @Input() set body(value: any[]) {
    if (value && value.length > 0) {
      this.bodies = value;
      this.cloneOriginData();
      this.updateDisplayedBodies();
    }
  }
  @Input() set searches(value: { id: string; forms: string }) {
    if (value) {
      this.search(value.id, value.forms);
      this.updateDisplayedBodies();
    }
  }
  @Output() dropdown = new EventEmitter<{ event: Event; data: any }>();

  bodies: any[] = [];
  private saveOriginData: any[] = [];
  displayedBodies: any[] = [];
  currentPage: number = 1;
  recordsPerPage: number = 5;
  recordsPerPageOptions: number[] = [5, 10, 20];

  constructor() {}

  ngOnInit(): void {
    this.cloneOriginData();
    this.updateDisplayedBodies();
  }

  rowClick(event: Event, item: any): void {
    console.log(item);
  }

  private search(id: string, forms: string): void {
    const dataFilter = this.saveOriginData.filter((item) =>
      item.id.includes(id)
    );

    this.bodies = dataFilter.length > 0 || !forms ? [...dataFilter] : [];
  }

  public resetSearch(): void {
    this.bodies = [...this.saveOriginData];
    this.updateDisplayedBodies();
  }

  private cloneOriginData(): void {
    this.saveOriginData = [...this.bodies];
  }

  onClickDropdown(event: Event, data: any): void {
    this.dropdown.emit({ event, data });
  }

  changeRecordsPerPage(records: any): void {
    this.recordsPerPage = records;
    this.currentPage = 1;
    this.updateDisplayedBodies();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedBodies();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.bodies.length / this.recordsPerPage);
  }

  get pages(): number[] {
    const pagesArray: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  updateDisplayedBodies(): void {
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.displayedBodies = this.bodies.slice(startIndex, endIndex);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedBodies();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedBodies();
    }
  }
}
