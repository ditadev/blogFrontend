import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyArticleComponent } from './view-my-article.component';

describe('ViewMyArticleComponent', () => {
  let component: ViewMyArticleComponent;
  let fixture: ComponentFixture<ViewMyArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMyArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
