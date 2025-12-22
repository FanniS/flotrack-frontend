import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDeleteForm } from './transaction-delete-form';

describe('TransactionDeleteForm', () => {
  let component: TransactionDeleteForm;
  let fixture: ComponentFixture<TransactionDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDeleteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
