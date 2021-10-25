import React from 'react';

const FontSize: React.FC = () => (
    <select className="ql-size" defaultValue="11">
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="22">22</option>
        <option value="24">24</option>
        <option value="30">30</option>
        <option value="36">36</option>
    </select>
);

export default FontSize;
