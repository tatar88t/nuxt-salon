<template>
  <div>
    <header>
      <nav>
        <ul>
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings">Settings</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/products">products</NuxtLink>
          </li>
        </ul>
        NANR LAYOUT PRODUCTS...
      </nav>
    </header>

    <div>
      <slot></slot>
    </div>
  </div>
</template>
