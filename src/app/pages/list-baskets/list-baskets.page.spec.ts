import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBasketsPage } from './list-baskets.page';

describe('ListBasketsPage', () => {
  let component: ListBasketsPage;
  let fixture: ComponentFixture<ListBasketsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBasketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
