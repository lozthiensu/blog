import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { Ng2PaginationModule } from 'ng2-pagination';
import { UserServiceService } from './user-service.service';
import { RouterModule } from '@angular/router';
import { ThreadViewComponent } from './thread-view/thread-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { TrustAllHTMLPipe } from './trust-all-html.pipe';
import { CategoryViewComponent } from './category-view/category-view.component';
import { TagViewComponent } from './tag-view/tag-view.component';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SearchViewComponent } from './search-view/search-view.component';
import {APP_BASE_HREF} from '@angular/common';
import {PathLocationStrategy, LocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ThreadViewComponent,
    HomeViewComponent,
    TrustAllHTMLPipe,
    CategoryViewComponent,
    TagViewComponent,
    LoginDialogComponent,
    SearchViewComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    Ng2PaginationModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'bai-viet/:string/:id', component: ThreadViewComponent },
      { path: 'danh-muc/:string/:id', component: CategoryViewComponent },
      { path: 'tag/:string', component: TagViewComponent },
      { path: 'tim-kiem/:string', component: SearchViewComponent },
      { path: '', component: HomeViewComponent },//home
      { path: '**', component: AppComponent }//notfound
    ]),
    YoutubePlayerModule
  ],
  providers: [
    Title,
    UserServiceService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  entryComponents: [ LoginDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
