import {
    ui, Button, NavigationView, TextView, Page, ScrollView, Composite, TextInput,
    SearchAction,CollectionView
} from 'tabris';

import {customButton} from "./customButton";

const HORIZONTAL_MARGIN = 16;
const VERTICAL_MARGIN = 8;

class MainPage {

    navigationView: NavigationView;

    constructor() {

        this.navigationView = new NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(ui.contentView);

        new Page({
            title: 'Daily To Do',
            background: '#cdddf4'
        }).appendTo(this.navigationView);

        let barInput = new TextInput({
            top: '90%', left: 0, right: '10%',
            message: 'Enter Activity...'
        }).on('accept' || 'select', () => {
            new Button({
                top: 'prev() 20', left: '5%', right: "5%",
                text: barInput.text
            }).on('select' || 'accept', function () {
                PROPOSALS.push(this.text);
                console.log(PROPOSALS);
                this.appendTo(scrollView1);
                this.dispose
            }).appendTo(scrollView);
        }).appendTo(ui.contentView);

        new customButton({
            left: "90%", top: "90%"
        }, '✍').on('tap', () => {
            new Button({
                top: 'prev() 20', left: '5%', right: "5%",
                text: barInput.text
            }).on('tap', function () {
                PROPOSALS.push(this.text);
                console.log(PROPOSALS);
                this.appendTo(scrollView1);
                this.dispose
            }).appendTo(scrollView);
        }).appendTo(ui.contentView);

        let composite1 = new Composite({
            left: 0, top: '20%', bottom: '10%', right: 0,
            background: '#000000'
        }).appendTo(ui.contentView);

        let scrollView = new ScrollView({
            left: 0, right: 0, top: 0, bottom: 0,
            direction: 'vertical',
            background: '#f7f7f7'
        }).appendTo(composite1);

        // Search Bar
        let searchBox = new Composite({
            centerX: 0, centerY: 0
        }).appendTo(ui.contentView);

        let textView = new TextView().appendTo(searchBox);

        let PROPOSALS = [];
        let savedNotes = [];

        new customButton({
            top: '10', left: '5%'
        }, ' Notes ✎ ').on('tap', () => {
            let navigationView2 = new NavigationView({
                left: 0, top: 0, right: 0, bottom: 0
            }).appendTo(ui.contentView);

            let createTaskPage = new Page({
                title: 'Page'
            }).appendTo(navigationView2);

            new customButton({
                top: '0%', left: '5%',
            }, ' Home ').on('tap', () => {

                window.plugins.toast.showShortBottom('Home!');
            }).appendTo(ui.contentView);

            new customButton({
                top: '3%', left: '5%',
            }, ' Past Notes ').on('tap', () => {

                let navigationView3 = new NavigationView({
                    left: 0, top: 0, right: 0, bottom: 0
                }).appendTo(ui.contentView);

                new Page({
                    title: ' Past Notes ',
                }).appendTo(navigationView3);

                console.log("AHH");
                let fetchRequest: Request = new Request('http://192.168.100.186:3000/test/all', {
                    method: 'GET',
                    body: null,
                });
                fetch(fetchRequest).then((res)=>{
                    console.log(res);
                    return res.json();
                }).then((json)=>{
                    savedNotes = json;
                    console.log(savedNotes);
                    console.log('Get Success');
                    console.log(json);
                }).catch((ex)=>{
                    console.log('Get Request Error');
                    console.error(ex)
                });


                let items = [];
                console.log(savedNotes.length);
                for (var i = 0; i < savedNotes.length; i++){
                    console.log(savedNotes[i]);
                    items.push({
                        title: savedNotes[i],
                        sender: 'Nikola Uzelac',
                        time: 'Today',
                        sortable: true,
                        resizeable: true
                    })
                }

                let collectionView = new CollectionView({
                    left: 0, right: 0, top: '7%', bottom: "10%",
                    itemCount: items.length,
                    cellHeight: 64,
                    createCell: () => {
                        let cell = new Composite({'background': '#10b4d0'});
                        let container = new Composite({
                            id: 'container',
                            left: 0, top: 0, bottom: 0, right: 0,
                            background: 'white'
                        }).on('panHorizontal', event => handlePan(event))
                            .appendTo(cell);
                        new TextView({
                            id: 'senderText',
                            top: VERTICAL_MARGIN, left: HORIZONTAL_MARGIN,
                            font: 'bold 18px'
                        }).appendTo(container);
                        new TextView({
                            id: 'titleText',
                            bottom: VERTICAL_MARGIN, left: HORIZONTAL_MARGIN
                        }).appendTo(container);
                        new TextView({
                            id: 'timeText',
                            textColor: '#b8b8b8',
                            top: VERTICAL_MARGIN, right: HORIZONTAL_MARGIN
                        }).appendTo(container);
                        new Composite({
                            left: 0, bottom: 0, right: 0, height: 1,
                            background: '#777cb8'
                        }).appendTo(cell);
                        return cell;
                    },
                    updateCell: (view, index) => {
                        let item = items[index];
                        view.find('#container').first().item = item;
                        view.find('#senderText').set('text', item.sender);
                        view.find('#titleText').set('text', item.title);
                        view.find('#timeText').set('text', item.time);
                    }
                }).appendTo(ui.contentView);

                function handlePan(event) {
                    let {target, state, translationX} = event;
                    target.transform = {translationX};
                    if (state === 'end') {
                        handlePanFinished(event);
                    }
                }

                function handlePanFinished(event) {
                    let {target, velocityX, translationX} = event;
                    let beyondCenter = Math.abs(translationX) > target.bounds.width / 2;
                    let fling = Math.abs(velocityX) > 200;
                    let sameDirection = sign(velocityX) === sign(translationX);
                    // When swiped beyond the center, trigger dismiss if flinged in the same direction or let go.
                    // Otherwise, detect a dismiss only if flinged in the same direction.
                    let dismiss = beyondCenter ? sameDirection || !fling : sameDirection && fling;
                    if (dismiss) {
                        animateDismiss(event);
                    } else {
                        animateCancel(event);
                    }
                }

                function animateDismiss({target, translationX}) {
                    let bounds = target.bounds;
                    target.animate({
                        transform: {translationX: sign(translationX) * bounds.width}
                    }, {
                        duration: 200,
                        easing: 'ease-out'
                    }).then(() => {
                        let index = items.indexOf(target.item);
                        items.splice(index, 1);
                        collectionView.remove(index);
                    });
                }

                function animateCancel({target}) {
                    target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
                }

                function sign(number) {
                    return number ? number < 0 ? -1 : 1 : 0;
                }


            }).appendTo(ui.contentView);

            new customButton({
                top: '2%', right: '5%'
            }, " Save ").on('tap', () => {
                window.plugins.toast.showShortBottom('Saved Note!');
            }).appendTo(ui.contentView);

            new TextInput({
                top: 0, left: 0, right: 0, bottom: 0,
                text: "",
                message: 'Type whats on your mind...'
            }).on('accept', function ({text}) {

                let fetchRequest: Request = new Request('http://192.168.100.186:3000/test', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({title: text}),
                });

                console.log(JSON.stringify({text: text}));

                fetch(fetchRequest).then((res)=>{
                    //callback(res);
                    return res.json();
                }).then((json)=>{
                    console.log('Post Success');
                    //console.log(json);
                }).catch((ex)=>{
                    console.log('Post Request Error');
                    console.error(ex)
                });
            }).appendTo(createTaskPage);

            new customButton({
                top: '10', left: '5%'
            }, ' Notes ✎ ').on('tap', () => {

            })
        }).appendTo(ui.contentView);

        let action = new SearchAction({
            title: 'Search',
        }).on('select', function () {
            this.text = '';
        }).on('input', function ({text}) {
            updateProposals(text);
        }).on('accept', function ({text}) {
            textView.text = 'Selected "' + text + '"';
        }).appendTo(this.navigationView);

        updateProposals('');

        new Button({
            text: 'Open Search',
            top: '10%', right: '35%',
        }).on('select', function () {
            action.open();
        }).appendTo(ui.contentView);

        function updateProposals(query) {
            action.proposals = PROPOSALS.filter(function (proposal) {
                return proposal.indexOf(query.toLowerCase()) !== -1;
            });
        }

        // Completed Tasks section Test

        let drawer = ui.drawer;

        drawer.enabled = true;

        drawer.on('open', () => console.log('drawer opened'))
            .on('close', () => console.log('drawer closed'));

        let arrow = '⇦';
        createLabel(arrow)
            .on('tap', () => drawer.open())
            .appendTo(composite1);

        createLabel('Completed Tasks')
            .on('tap', () => drawer.close())
            .appendTo(drawer);


        function createLabel(text) {
            return new TextView({
                left: 10, centerY: 0,
                text: text,
                font: '22px Arial'
            });
        }

        let composite2 = new Composite({
            left: 0, top: 0, bottom: 0, right: 0,
            background: '#07ffd1'
        }).appendTo(drawer);

        new TextView({
            top: '3%', centerX: 0,
            text: 'Completed Tasks',
            font: '22px Courier New'
        }).appendTo(composite2);

        let scrollView1 = new ScrollView({
            left: 0, right: 0, top: '10%', bottom: 0,
            direction: 'vertical',
            background: '#9ec6f4'
        }).appendTo(composite2);

    }
} new MainPage();