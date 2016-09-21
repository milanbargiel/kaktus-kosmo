/* Universe definition
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/**
  * Reference: http://stackoverflow.com/questions/9539294/adding-new-nodes-to-force-directed-layout/9544595#9544595
  * A function is an object.
  * An object can act as a class, containing a constructor and a set of related methods (this).
*/

export default function Universe(selector) {
  let w = $(selector).innerWidth();
  let h = $(document).height(); // h is equal to height of HTML document
  const marginCircleMenu = 24;  // distance between menu and planet (tick function)
  const circleRadius = 50;

  /* Create svg container to hold the visualization */
  const svg = d3.select(selector)
      .append('svg')
      .attr('width', w)
      .attr('height', h);

  /* Create div container to hold menus */
  const menuContainer = d3.select(selector)
    .append('div')
    .attr('class', 'labels');

  /* Clickable background rect to clear the current selection */
  const backgroundRect = svg.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'clear-rect');


  /* Create d3 force layout */
  const force = d3.layout.force()
    .gravity(0)
    .charge(0)
    .size([w, h]);

  const nodes = force.nodes();  // force dataset
  let labels = null;            // holding menus of nodes
  let circles = null;           // holding dom elements

/* Functions
–––––––––––––––––––––––––––––––––––––––––––––––––– */

  /* Reference: http://bl.ocks.org/mbostock/1129492 */
  function bindToRectangle() {
    /* Returns a function which works on data of a single node */
    return (d) => {
      d.x = Math.max(circleRadius, Math.min(w - circleRadius, d.x));
      d.y = Math.max(circleRadius, Math.min(h - circleRadius, d.y));
    };
  }

  /* Reference: http://vallandingham.me/building_a_bubble_cloud.html */
  function updateNodes() {
    /* Join selection to data array -> results in three new selections enter, update and exit */
    circles = svg.selectAll('.planet')
      .data(nodes, d => d._id); // uniquely bind data to the node selection

    /* Add missing elements by calling append on enter selection */
    circles.enter()
      .append('circle')
      .attr('r', circleRadius)
      .attr('class', 'planet')
      .call(force.drag);

    /* Remove surplus elements from exit selection */
    circles.exit().remove();
  }

  function updateLabels() {
    /* Join selection to data array -> results in three new selections enter, update and exit */
    labels = menuContainer.selectAll('.planet__label')
      .data(nodes, d => d._id); // uniquely bind data to the node selection

    const labelsEnter = labels.enter()
      .append('div')
      .attr('class', 'planet__label')
      .append('div')
      .attr('class', 'dropdown');

    labelsEnter.append('a')
      .attr('class', 'planet__header')
      .text(d => d.name)
      /* Add dx (half width of menu div) and dy property (height of menu div) to each node object */
      /* Use values to center and position menu div on circle in tick function */
      .each(function setMeasures(d) { // use function so this refers to dom element (menu__header)
        const elemMeasures = this.getBoundingClientRect();
        d.dx = elemMeasures.width / 2;
        d.dy = elemMeasures.height;
      });

    /* Create Menu Navigation */
    const menuNavigation = '<li><a class="dropdown__link">ENTER</a></li><li><a class="dropdown__link">Rename</a></li><li><a class="dropdown__link">Delete</a></li>';
    labelsEnter.append('ul')
      .attr('class', 'dropdown__content')
      .html(menuNavigation);

    labels.exit()
      .remove();
  }

  function update() {
    /* Update nodes and their menus */
    updateNodes();
    updateLabels();

    /* Draw circle: Set svg circle and html element attributes to force updated values */
    force.on('tick', () => {
      circles.each(bindToRectangle())
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      /* Html elements with position absolute */
      labels
        /* Center menu: d.x - half menu width */
        .style('left', d => `${d.x - d.dx}px`)
        /* Position menu vertically */
        .style('top', d => `${d.y - d.dy - circleRadius - marginCircleMenu}px`);
    });

    /* Restart the force layout */
    force.start();
  }

  /* Reference: http://bl.ocks.org/mbostock/3355967 */
  function resize() {
    w = $(selector).innerWidth();
    h = $(document).height();
    svg.attr('width', w).attr('height', h);
    backgroundRect.attr('width', w).attr('height', h);
    force.size([w, h]).resume();
  }

  d3.select(window).on('resize', resize);

/* Add, remove, initialize
–––––––––––––––––––––––––––––––––––––––––––––––––– */

  function findNodeIndex(id) {
    return nodes.findIndex(node => node._id === id);
  }

  /* Methods - accessible from outside the function */
  this.addNode = (object) => {
    nodes.push(object);
    update();
  };

  this.removeNode = (id) => {
    const i = findNodeIndex(id);
    if (i !== -1) {
      nodes.splice(i, 1);
      update();
    }
  };

  this.initialize = (dataset) => {
    nodes.push(...dataset);
    update();
  };
}
