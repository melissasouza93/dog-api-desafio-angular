import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs";
import { Dog } from "../models/dog.model";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class DogService {
  private apiUrl = 'https://api.thedogapi.com/v1';
  private apiKey = 'live_lk7qjmBlZ0ZPxG5mAqBGlwNvezrG4MaupQky44L2jwMAnyAgzLmkEHry9rcEEnJh';

  private allDogs = signal<Dog[]>([]); // Todos os cães carregados
  filteredDogs = signal<Dog[]>([]); // Cães filtrados
  paginatedDogs = signal<Dog[]>([]); // Cães paginados
  loading = signal(false);
  error = signal<string | null>(null);

  searchControl = new FormControl('');

  currentPage = signal(0);
  itemsPerPage = 9;
  totalItems = signal(0);

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.init();
  }

  init() {
    this.loadInitialData();
    this.setupSearch();
  }

  private loadInitialData() {
    if (this.allDogs().length > 0) return; // Já carregou os dados

    this.loading.set(true);
    this.error.set(null);

    this.http.get<Dog[]>(`${this.apiUrl}/breeds`, {
      headers: { 'x-api-key': this.apiKey }
    }).subscribe({
      next: (dogs) => {
        this.allDogs.set(dogs);
        this.totalItems.set(dogs.length);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Erro ao carregar dados');
        this.loading.set(false);
      }
    });
  }

  private applyFilters() {
    const query = this.searchControl.value?.toLowerCase() || '';
    const filtered = query
      ? this.allDogs().filter(dog =>
          dog.name.toLowerCase().includes(query) ||
          (dog.temperament?.toLowerCase().includes(query)) ||
          (dog.origin?.toLowerCase().includes(query))
        )
      : [...this.allDogs()];

    this.filteredDogs.set(filtered);
    this.totalItems.set(filtered.length);

    this.applyPagination();
  }

  private applyPagination() {
    const startIndex = this.currentPage() * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginated = this.filteredDogs().slice(startIndex, endIndex);
    this.paginatedDogs.set(paginated);
  }

  changePage(newPage: number) {
    this.currentPage.set(newPage);
    this.applyPagination();
  }

  changePageSize(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage.set(0);
    this.applyPagination();
  }

  private setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.currentPage.set(0);
        this.applyFilters();
      });
  }

  addDog(newDog: Dog) {
    this.allDogs.set([newDog, ...this.allDogs()]);
    this.applyFilters();
  }

  updateDog(updatedDog: Dog) {
    this.allDogs.set(
      this.allDogs().map(dog =>
        dog.id == updatedDog.id ? updatedDog : dog
      )
    );
    this.applyFilters();
  }

  deleteDog(id: string) {
    this.allDogs.set(
      this.allDogs().filter(dog => dog.id !== id)
    );
    this.applyFilters();
  }

  getDogById(id: string): Dog {
    return this.allDogs().find(dog => dog.id == id) || {} as Dog;
  }

  getDogImage(imageId: string | null): SafeUrl | string {
    if (!imageId) return 'assets/images/dog-placeholder.jpg';

    if (typeof imageId === 'string' && imageId.startsWith('data:image')) {
      return imageId;
    }

    const url = `https://cdn2.thedogapi.com/images/${imageId}.jpg`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getDogsLocal(): Dog[] {
    return this.allDogs();
  }

  loadDogsLocal() {
    this.applyFilters();
    this.loading.set(false);
  }
}
