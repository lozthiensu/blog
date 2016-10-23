import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { UserServiceService } from './user-service.service';
import { TrustAllHTMLPipe } from './trust-all-html.pipe';

import { MaterialModule } from '@angular/material';
import { Ng2PaginationModule } from 'ng2-pagination';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { AppComponent } from './app.component';
import { ThreadViewComponent } from './thread-view/thread-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { TagViewComponent } from './tag-view/tag-view.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SearchViewComponent } from './search-view/search-view.component';

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
      { path: '', component: HomeViewComponent },
      { path: '**', component: AppComponent }
    ]),
    YoutubePlayerModule
  ],
  providers: [
    Title,
    UserServiceService
  ],
  entryComponents: [ LoginDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
