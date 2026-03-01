import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasketDetailPage } from './basket-detail.page';

describe('BasketDetailPage', () => {
  let component: BasketDetailPage;
  let fixture: ComponentFixture<BasketDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
