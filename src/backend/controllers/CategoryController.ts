import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/backend/services";
import { CategoryDTO } from "@/backend/dto";
import { asyncHandler } from "@/backend/utils";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAllCategories(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const categories = await this.categoryService.getAllCategories();
      return NextResponse.json({ categories }, { status: 200 });
    });
  }

  async createCategory(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: CategoryDTO = await request.json();

      if (!body.name) {
        return NextResponse.json(
          { error: 'Campo "name" obbligatorio' },
          { status: 400 }
        );
      }

      const category = await this.categoryService.createCategory(body);

      return NextResponse.json(
        { message: "Categoria creata con successo", category },
        { status: 201 }
      );
    });
  }

  async updateCategory(request: NextRequest, categoryId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const categoryIdNum = parseInt(categoryId);
      if (isNaN(categoryIdNum)) {
        return NextResponse.json({ error: "Category ID deve essere un numero" }, { status: 400 });
      }

      const body: CategoryDTO = await request.json();
      if (Object.keys(body).length === 0) {
        return NextResponse.json({ error: "Nessun campo da aggiornare" }, { status: 400 });
      }

      const category = await this.categoryService.updateCategory(categoryIdNum, body);
      return NextResponse.json({ message: "Categoria aggiornata con successo", category }, { status: 200 });
    });
  }

  async deleteCategory(request: NextRequest, categoryId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const categoryIdNum = parseInt(categoryId);
      if (isNaN(categoryIdNum)) {
        return NextResponse.json({ error: "Category ID deve essere un numero" }, { status: 400 });
      }

      await this.categoryService.deleteCategory(categoryIdNum);
      return NextResponse.json({ message: "Categoria eliminata con successo" }, { status: 200 });
    });
  }
}
