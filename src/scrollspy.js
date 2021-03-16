export class ScrollSpy {
  constructor(menu, options = {}) {
    if (!menu) {
      throw new Error('First argument is query selector to your navigation.');
    }

    if (typeof options !== 'object') {
      throw new Error('Second argument must be instance of Object.');
    }

    let defaultOptions = {
      sectionClass: '.scrollspy',
      menuActiveTarget: 'li > a',
      offset: 0,
      hrefAttribute: 'href',
      activeClass: 'active'
    };

    this.menuList = menu instanceof HTMLElement ? menu : document.querySelector(menu);
    this.menu = document.getElementById('mainNav');
    this.options = Object.assign({}, defaultOptions, options);
    this.sections = document.querySelectorAll(this.options.sectionClass);
    this.scrolling = false;
    console.log('Booted', this.sections, this.menuList);
  }

  inView(el) {

    if (!el) {
      console.log(el);

      return true;
    }

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
  }

  onScroll() {
    const section = this.getSectionsInView();
    const menuItem = this.getMenuItemBySections(section);

    if (this.scrolling) return;

    if (menuItem) {

      for (const item in menuItem) {

        if(!menuItem[item]) return;

        this.removeCurrentActive({ ignore: menuItem[item] });

        // Only change when menu item isn't visible
        if (menuItem[item] && !this.inView(menuItem[item]) && !this.scrolling) {
          console.log('menu item not in view', menuItem[item], this.menu);
          this.scrolling = true;
          this.menu.scrollTop = menuItem[item].offsetTop - 300;
        }

        this.setActive(menuItem[item]);
      }
    }
  }

  getMenuItemBySections(section) {
    if (!section) return;

    let items = [];

    for (const s in section) {
      const id = section[s].getAttribute('id');
      items.push(this.menuList.querySelector(`[${this.options.hrefAttribute}="#${id}"]`));
    }

    return items;
  }

  getSectionsInView() {
    let sections = [];
    for (let i = 0; i < this.sections.length; i++) {
      const startAt = this.sections[i].offsetTop;
      const endAt = startAt + this.sections[i].offsetHeight;
      const currentPosition = (document.documentElement.scrollTop || document.body.scrollTop) + this.options.offset;
      const isInView = currentPosition > startAt && currentPosition <= endAt;

      if (isInView) {
        sections.push(this.sections[i]);
      }
    }

    return sections;
  }

  getSectionInViewByI(i) {
    const startAt = this.sections[i].offsetTop;
    const endAt = startAt + this.sections[i].offsetHeight;
    const currentPosition = (document.documentElement.scrollTop || document.body.scrollTop) + this.options.offset;
    return currentPosition > startAt && currentPosition <= endAt;
  }

  setActive(activeItem) {
    const isActive = activeItem.classList.contains(this.options.activeClass);
    if (!isActive) {
      this.scrolling = false;
      activeItem.classList.add(this.options.activeClass);
    }
  }

  removeCurrentActive({ ignore }) {

    if (!ignore) return;

    const {
      hrefAttribute,
      menuActiveTarget
    } = this.options;
    const items = `${menuActiveTarget}.active:not([${hrefAttribute}="${ignore.getAttribute(hrefAttribute)}"])`;
    const menuItems = this.menuList.querySelectorAll(items);

    menuItems.forEach((item) => item.classList.remove(this.options.activeClass));
  }
}
