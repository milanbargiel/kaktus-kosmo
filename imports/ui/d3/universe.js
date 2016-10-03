/* Helper function to generate path from parameters author and slug for anchor tags */
import { pathForProject } from '../../lib/common-functions.js';

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

  /* Create div container to hold labels */
  const labelContainer = d3.select(selector)
    .append('div')
    .attr('class', 'labels');

  /* Clickable background rect to clear the current selection */
  const backgroundRect = svg.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'clear-rect')
    .on('click', clear);


  /* Create d3 force layout */
  const force = d3.layout.force()
    .gravity(0.01)
    .friction(0.9)
    .charge(-800)
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

  /* Assign measure properties to node object -> calculation of planet__header position */
  function setMeasures() {
    /* Returns a function which works on data of a single node */
    return function (d) {
      const elemMeasures = this.getBoundingClientRect(); // this refers to dom element
      /* Add dx (half width of menu div) and dy property (height of menu div) to each node object */
      /* Use values to center and position menu div on circle in tick function */
      d.dx = elemMeasures.width / 2;
      d.dy = elemMeasures.height;
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
      /* Bind connectEvents method to elements */
      .call(connectEvents)
      .call(force.drag);

    /* Remove surplus elements from exit selection */
    circles.exit().remove();
  }

  function updateLabels() {
    /* Join selection to data array -> results in three new selections enter, update and exit */
    labels = labelContainer.selectAll('.planet__label')
      .data(nodes, d => d._id); // uniquely bind data to the node selection

    /* Update Selection, update old elements */
    labels.select('.planet__header')
      .text(d => d.name)
      .each(setMeasures());

    /* Enter Selection */
    const labelsEnter = labels.enter()
      .append('div')
      .attr('class', 'planet__label')
      .append('div')
      .attr('class', 'dropdown');

    /* Planet header */
    labelsEnter.append('a')
      .attr('class', 'planet__header')
      .text(d => d.name)
      .each(setMeasures());

    /* Create dropdown navigation links */
    const dropdown = labelsEnter.append('ul')
      .attr('class', 'dropdown__content');

    /* Enter */
    dropdown.append('a')
      .attr('class', 'dropdown__link')
      .attr('href', d => pathForProject(d.author, d.slug))
      .text('ENTER');

    /* Divider */
    dropdown.append('div')
      .attr('class', 'dropdown__divider');

    /* Share project */
    dropdown.append('a')
      .attr('class', 'js-dialogue dropdown__link')
      .attr('data-dialogue-template', 'Project_share')
      .text('Share');

    /* Rename */
    dropdown.append('a')
      .attr('class', 'js-dialogue dropdown__link')
      .attr('data-dialogue-template', 'Project_rename')
      .text('Rename');

    /* Delete */
    dropdown.append('a')
      .attr('class', 'js-dialogue dropdown__link')
      .attr('data-dialogue-template', 'Project_remove')
      .text('Delete');

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

/* Interactions
–––––––––––––––––––––––––––––––––––––––––––––––––– */

  /* Reference: http://vallandingham.me/building_a_bubble_cloud.html */
  function click(object) { // object is selected nodes object
    /* Unfix all nodes */
    nodes.forEach((node) => { node.fixed = false; });
    /* iterates over nodes, if callback returns true, class is given */
    circles.classed('planet--selected', (node) => {
      if (object._id === node._id) {
        node.fixed = true; // fix nodes on click event
        return true;
      }
      return false;
    });
    labels.selectAll('.planet__header').classed('planet__header--selected', node => object._id === node._id);
  }

  /* Click on background rect triggers clear function */
  function clear() {
    circles.classed('planet--selected', false);
    labels.selectAll('.planet__header').classed('planet__header--selected', false);
    nodes.forEach((node) => { node.fixed = false; });
  }

  function mouseover(object) {
    circles.classed('planet--hover', node => object._id === node._id);
    labels.selectAll('.planet__header').classed('planet__header--hover', node => object._id === node._id);
  }

  function mouseout() {
    circles.classed('planet--hover', false);
    labels.selectAll('.planet__header').classed('planet__header--hover', false);
  }

  function connectEvents(selection) {
    selection.on('mousedown', click);
    selection.on('mouseover', mouseover);
    selection.on('mouseout', mouseout);
  }

/* Add, remove, rename
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

  this.renameNode = (id, newName) => {
    const i = findNodeIndex(id);
    nodes[i].name = newName;
    update();
  };
}
