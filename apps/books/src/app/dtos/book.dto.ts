export class CreateBookDto {
  title: string;
  author: string;
  genre: string;
  publicationYear: string;
  price: number;
  access?: string;
}

export class UpdateBookDto {
  title?: string;
  author?: string;
  genre?: string;
  publicationYear?: string;
  price?: number;
  access?: string;
}

export class SearchBooksDto {
  title?: string;
  author?: string;
  genre?: string;
  publicationYear?: string;
}
