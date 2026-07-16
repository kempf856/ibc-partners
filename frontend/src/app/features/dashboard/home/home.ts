import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {DashboardService} from './dashboard-service';

export interface Slide {
  title: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, AfterViewInit {

  private dashboardService = inject(DashboardService);

  message = signal('');

  slides = signal<Slide[]>([
    {
      title: 'Első',
      image: '/slide1.jpg'
    },
    {
      title: 'Második',
      image: '/slide2.jpg'
    },
    {
      title: 'Harmadik',
      image: '/slide3.jpg'
    }
  ]);

  @ViewChild('swiper') swiper!: ElementRef;

  ngAfterViewInit() {
    console.log('swiper init', this.swiper.nativeElement);

    Object.assign(this.swiper.nativeElement, {
      navigation: true,
      pagination: true,
      autoplay: {
        delay: 5000
      }
    });

    this.swiper.nativeElement.initialize();
    console.log(this.swiper.nativeElement.swiper);
  }

  ngOnInit(): void {
    this.dashboardService.welcome()
      .subscribe(dto => this.message.set(dto.message));
  }
}
