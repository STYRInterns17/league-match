import {
    ui, Button, NavigationView, TextView, Page, ScrollView, Composite, TextInput,
    SearchAction,CollectionView
} from 'tabris';

import {customButton} from "./customButton";
const {Button, NavigationView, Page, ui} = require('tabris');

let pageCount = 0;

let navigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

createPage();

function createPage(title) {
    let page = new Page({
        title: title || 'Initial Page',
        background: '#0000FF'
    }).appendTo(navigationView);
    new Button({
        left: 16, top: 16, right: 16,
        text: 'Create another page'
    }).on('select', () => createPage('Page ' + (++pageCount)))
        .appendTo(page);
    new Button({
        left: 16, top: 'prev() 16', right: 16,
        text: 'Go back'
    }).on('select', () => page.dispose())
        .appendTo(page);
    new Button({
        left: 16, top: 'prev() 16', right: 16,
        text: 'Go to initial page'
    }).on('select', () => {
        navigationView.pages().dispose();
        createPage();
    }).appendTo(page);
    return page;
}

